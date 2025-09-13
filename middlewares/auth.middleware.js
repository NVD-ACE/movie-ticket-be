import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;
export const authorize = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        {
            token = req.headers.authorization.split(" ")[1];
        }
        if(!token)
        {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findByPk(decoded.userId);
        if(!user)
        {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    }catch (error) {
        res.status(401).json({
            message: "Unauthorized",
            error: error.message,
        })
    }
}

// 2. Middleware phân quyền theo role
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userRole = req.user.Role?.name;
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
          code: 'INSUFFICIENT_ROLE',
          userRole,
          requiredRoles: allowedRoles
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({ 
        message: 'Authorization error',
        code: 'AUTHZ_ERROR'
      });
    }
  };
};

// 3. Middleware phân quyền theo permission cụ thể
export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userPermissions = req.user.Role?.permissions || [];
      
      // Kiểm tra xem user có ít nhất một trong các permission required không
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
          code: 'INSUFFICIENT_PERMISSION',
          userPermissions,
          requiredPermissions
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ 
        message: 'Authorization error',
        code: 'AUTHZ_ERROR'
      });
    }
  };
};

// 4. Middleware kiểm tra quyền truy cập resource (owner hoặc admin)
export const requireOwnershipOrRole = (...adminRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userId = req.user.id;
      const targetUserId = parseInt(req.params.id || req.params.userId);
      const userRole = req.user.Role?.name;

      // Cho phép nếu là chính user đó hoặc có role admin
      const isOwner = userId === targetUserId;
      const isAdmin = adminRoles.includes(userRole);

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
          message: 'Access denied. You can only access your own resources or need admin privileges',
          code: 'OWNERSHIP_REQUIRED'
        });
      }

      // Thêm flag để biết user đang truy cập với quyền gì
      req.accessType = isOwner ? 'owner' : 'admin';
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ 
        message: 'Authorization error',
        code: 'AUTHZ_ERROR'
      });
    }
  };
};

// 5. Middleware rate limiting theo user
const userRequestCounts = new Map();

export const rateLimitByUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(); // Skip if not authenticated
    }

    const userId = req.user.id;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    const userRequests = userRequestCounts.get(userId) || [];
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        resetTime: new Date(validRequests[0] + windowMs)
      });
    }

    // Add current request
    validRequests.push(now);
    userRequestCounts.set(userId, validRequests);

    next();
  };
};

// 6. Middleware log hoạt động user
export const logUserActivity = (action) => {
  return (req, res, next) => {
    // Log trước khi thực hiện action
    console.log(`[${new Date().toISOString()}] User ${req.user?.id} (${req.user?.Role?.name}) attempting: ${action}`);
    
    // Override res.json để log kết quả
    const originalJson = res.json;
    res.json = function(data) {
      const statusCode = res.statusCode;
      const success = statusCode >= 200 && statusCode < 300;
      
      console.log(`[${new Date().toISOString()}] User ${req.user?.id} ${action}: ${success ? 'SUCCESS' : 'FAILED'} (${statusCode})`);
      
      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

// 7. Middleware kiểm tra account status
export const requireActiveAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.isActive) {
    return res.status(403).json({ 
      message: 'Account is deactivated',
      code: 'ACCOUNT_INACTIVE'
    });
  }

  if (req.user.isLocked) {
    return res.status(403).json({ 
      message: 'Account is locked',
      code: 'ACCOUNT_LOCKED'
    });
  }

  next();
};

// 8. Helper function để tạo middleware chain
export const createAuthChain = (...middlewares) => {
  return middlewares;
};