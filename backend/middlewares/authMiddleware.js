const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");
const { User } = require("../models");

// Protect routes - JWT authentication required
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1) Check for token in cookies
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // 2) Check for token in Authorization header
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to access.", 401)
      );
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // 4) Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // 5) Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    logger.error(`Authentication error: ${err.message}`);
    next(new AppError("Invalid or expired token. Please log in again.", 401));
  }
};

// Role-based authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// Add this to your User model
User.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
