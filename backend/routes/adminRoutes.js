const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getSystemStats,
} = require("../controllers/adminController");
const {
  protect,
  restrictTo,
  verifyAdmin,
  preventAdminSelfAction,
  validateObjectId,
} = require("../middlewares");

// All admin routes require authentication and admin privileges
router.use(protect, restrictTo("admin"), verifyAdmin);

// User management
router.get("/users", getAllUsers);
router.patch(
  "/users/:userId/toggle",
  validateObjectId,
  preventAdminSelfAction("modify"),
  toggleUserStatus
);
router.delete(
  "/users/:userId",
  validateObjectId,
  preventAdminSelfAction("delete"),
  deleteUser
);

// System statistics
router.get("/stats", getSystemStats);

module.exports = router;
