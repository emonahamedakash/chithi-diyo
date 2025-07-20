const AppError = require("../utils/appError");

// Verify admin status
exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
};

// Prevent admin self-deletion
exports.preventAdminSelfAction = (action) => {
  return (req, res, next) => {
    if (req.user.id === req.params.userId) {
      return next(
        new AppError(`You cannot ${action} your own admin account`, 403)
      );
    }
    next();
  };
};
