const { User, MessageLink, AnonymousMessage } = require("../models");
const AppError = require("../utils/appError");

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "isActive", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Prevent modifying own account
    if (user.id === req.user.id) {
      throw new AppError("You cannot modify your own status", 403);
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          isActive: user.isActive,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Prevent deleting own account
    if (user.id === req.user.id) {
      throw new AppError("You cannot delete your own account", 403);
    }

    await user.destroy();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Get system statistics
exports.getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const totalLinks = await MessageLink.count();
    const activeLinks = await MessageLink.count({ where: { isActive: true } });
    const totalMessages = await AnonymousMessage.count();

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalLinks,
          activeLinks,
          totalMessages,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
