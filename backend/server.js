require("dotenv").config();
const http = require("http");
const app = require("./app");
const db = require("./config/db");
const logger = require("./utils/logger");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

// Cluster mode for production
if (process.env.NODE_ENV === "production" && cluster.isMaster) {
  logger.info(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.error(`Worker ${worker.process.pid} died`);
    // Restart worker if it died
    cluster.fork();
  });

  return;
}

// Normalize port
const port = normalizePort(process.env.PORT || 5000);
app.set("port", port);

// Create HTTP server
const server = http.createServer(app);

// Enhanced database connection with retry logic
const connectWithRetry = async (retries = 5, interval = 5000) => {
  try {
    await db.authenticate();
    logger.info("Database connected successfully");

    // Start server
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);

    // Run migrations if needed
    if (process.env.RUN_MIGRATIONS === "true") {
      await db.sync({ alter: true });
      logger.info("Database migrations completed");
    }
  } catch (err) {
    logger.error(
      `Database connection failed (${retries} retries left):`,
      err.message
    );
    if (retries > 0) {
      setTimeout(() => connectWithRetry(retries - 1, interval), interval);
    } else {
      logger.error("Maximum database connection retries reached. Exiting...");
      process.exit(1);
    }
  }
};

// Normalize port number
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port;
  return false;
}

// Enhanced server error handler
function onError(error) {
  if (error.syscall !== "listen") throw error;

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      logger.error("Server error:", error);
      throw error;
  }
}

// Enhanced server listening handler
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  const workerInfo = cluster.worker
    ? `Worker ${cluster.worker.id}`
    : "Standalone";

  logger.info(`
    ${workerInfo} listening on ${bind}
    Environment: ${process.env.NODE_ENV || "development"}
    Process ID: ${process.pid}
    Database: ${db.config.database}@${db.config.host}
  `);
}

// Enhanced error handling
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "Reason:", reason);
  // Consider restarting the server in production
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  // In production, restart after logging
  process.exit(1);
});

// Graceful shutdown with timeout
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");

  const shutdownTimeout = setTimeout(() => {
    logger.warn("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000); // 10 seconds timeout

  server.close(() => {
    clearTimeout(shutdownTimeout);
    logger.info("Server closed");

    // Close database connection if needed
    if (db.connection) {
      db.connection.close().then(() => {
        logger.info("Database connection closed");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});

// Start the application
connectWithRetry();

// Export for testing purposes
module.exports = {
  server,
  app,
  db,
};
