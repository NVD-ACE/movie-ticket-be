import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const userRoute = express.Router();
userRoute.get("/", authorize, getUsers);
userRoute.get("/:id", authorize, getUserById);
userRoute.put("/:id", authorize, updateUser);
userRoute.delete("/:id", authorize, deleteUser);

export default userRoute;

// router.get(
//   "/users",
//   ...createAuthChain(
//     authenticateToken,
//     requireActiveAccount,
//     requireRole(ROLES.ADMIN, ROLES.MODERATOR),
//     logUserActivity("LIST_USERS")
//   ),
//   getUsers
// );

// // 4. Route cần permission cụ thể
// router.post(
//   "/users",
//   authenticateToken,
//   requireActiveAccount,
//   requirePermission(PERMISSIONS.USER_CREATE),
//   logUserActivity("CREATE_USER"),
//   createUser
// );

// // 5. Route cho phép owner hoặc admin
// router.get(
//   "/users/:id",
//   authenticateToken,
//   requireActiveAccount,
//   requireOwnershipOrRole(ROLES.ADMIN, ROLES.MODERATOR),
//   logUserActivity("VIEW_USER"),
//   getUserById
// );

// router.put(
//   "/users/:id",
//   authenticateToken,
//   requireActiveAccount,
//   requireOwnershipOrRole(ROLES.ADMIN),
//   logUserActivity("UPDATE_USER"),
//   updateUser
// );

// // 6. Route chỉ cho super admin
// router.delete(
//   "/users/:id",
//   authenticateToken,
//   requireActiveAccount,
//   requireRole(ROLES.SUPER_ADMIN),
//   logUserActivity("DELETE_USER"),
//   deleteUser
// );

// // 7. Route admin panel
// router.get(
//   "/admin/dashboard",
//   authenticateToken,
//   requireActiveAccount,
//   requirePermission(PERMISSIONS.ADMIN_PANEL),
//   getAdminDashboard
// );

// router.get(
//   "/admin/system-logs",
//   authenticateToken,
//   requireActiveAccount,
//   requireRole(ROLES.SUPER_ADMIN),
//   requirePermission(PERMISSIONS.SYSTEM_LOGS),
//   getSystemLogs
// );
