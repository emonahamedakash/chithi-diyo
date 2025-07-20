const AppError = require("../utils/appError");
const logger = require("../utils/logger");

// Development error handler - detailed error stack
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    // API errors
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Rendered website errors (if you have any)
  logger.error("ERROR 💥:", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

// Production error handler - no stack traces leaked
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't leak error details
    logger.error("ERROR 💥:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  // Rendered website errors (if you have any)
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  logger.error("ERROR 💥:", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

// Handle JWT errors
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

// Handle database errors
const handleSequelizeError = (err) => {
  // Handle unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors[0].path;
    return new AppError(
      `${field} already exists. Please use another value!`,
      400
    );
  }

  // Handle validation errors
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => e.message);
    return new AppError(`Invalid input data: ${errors.join(". ")}`, 400);
  }

  // Handle foreign key constraint errors
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return new AppError("Invalid reference data provided", 400);
  }

  // Handle database connection/timeout errors
  if (err.name === "SequelizeConnectionError") {
    return new AppError(
      "Database connection error. Please try again later.",
      503
    );
  }

  // Default for other Sequelize errors
  return new AppError("Database error occurred", 500);
};

// Global error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    // Handle JWT errors
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    // Handle Sequelize errors
    if (error.name?.startsWith("Sequelize"))
      error = handleSequelizeError(error);

    // Handle other operational errors
    sendErrorProd(error, req, res);
  }
};
