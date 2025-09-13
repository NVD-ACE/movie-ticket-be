export const PERMISSIONS = {
  // User permissions
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_LIST: 'user:list',
  
  // Profile permissions
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
  
  // Admin permissions
  ADMIN_PANEL: 'admin:panel',
  ADMIN_USERS: 'admin:users',
  ADMIN_ROLES: 'admin:roles',
  ADMIN_SETTINGS: 'admin:settings',
  
  // System permissions
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_LOGS: 'system:logs',
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
};
