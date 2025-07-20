const { User, MessageLink, AnonymousMessage } = require("../models");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");

// Get all users
exports.getAllUsers = async () => {
  try {
    return await User.findAll({
      attributes: ["id", "username", "email", "role", "isActive", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
  } catch (err) {
    logger.error("Failed to get users:", err);
    throw new AppError("Failed to get users", 500);
  }
};

// Toggle user status
exports.toggleUserStatus = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.isActive = !user.isActive;
    await user.save();

    return {
      id: user.id,
      isActive: user.isActive,
    };
  } catch (err) {
    logger.error("Failed to toggle user status:", err);
    throw err;
  }
};

// Delete user
exports.deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await user.destroy();
  } catch (err) {
    logger.error("Failed to delete user:", err);
    throw err;
  }
};

// Get system statistics
exports.getSystemStats = async () => {
  try {
    const [totalUsers, activeUsers, totalLinks, activeLinks, totalMessages] =
      await Promise.all([
        User.count(),
        User.count({ where: { isActive: true } }),
        MessageLink.count(),
        MessageLink.count({ where: { isActive: true } }),
        AnonymousMessage.count(),
      ]);

    return {
      totalUsers,
      activeUsers,
      totalLinks,
      activeLinks,
      totalMessages,
    };
  } catch (err) {
    logger.error("Failed to get system stats:", err);
    throw new AppError("Failed to get system statistics", 500);
  }
};
