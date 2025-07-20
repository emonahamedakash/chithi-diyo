const rateLimit = require("express-rate-limit");
const AppError = require("../utils/appError");

// Global rate limiter
exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many requests from this IP, please try again later",
        429
      )
    );
  },
});

// Auth-specific rate limiter (stricter)
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 auth requests per hour
  skipSuccessfulRequests: true, // only count failed attempts
  handler: (req, res, next) => {
    next(new AppError("Too many login attempts, please try again later", 429));
  },
});

// Message submission limiter
exports.messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 messages per hour
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many messages from this IP, please try again later",
        429
      )
    );
  },
});
