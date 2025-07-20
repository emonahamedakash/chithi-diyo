const winston = require("winston");
const { combine, timestamp, printf, colorize, json, errors } = winston.format;
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

// Custom log format for console output
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  if (stack) {
    log += `\n${stack}`;
  }
  return log;
});

// Custom log format for file output
const fileFormat = printf(({ level, message, timestamp, stack }) => {
  return JSON.stringify({
    timestamp,
    level: level.toUpperCase(),
    message,
    stack: stack || null,
  });
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Include stack traces for errors
    process.env.NODE_ENV === "production"
      ? json()
      : combine(colorize(), consoleFormat)
  ),
  transports: [
    // Console transport (colorized in development)
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat),
      silent: process.env.NODE_ENV === "test", // Disable in test environment
    }),

    // Daily rotating error log files
    new DailyRotateFile({
      filename: path.join("logs", "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "error",
      format: fileFormat,
    }),

    // Daily rotating combined log files
    new DailyRotateFile({
      filename: path.join("logs", "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      format: fileFormat,
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join("logs", "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join("logs", "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
});

// Handle uncaught exceptions (outside Express)
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

// Stream for morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
