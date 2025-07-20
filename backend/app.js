const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const createError = require("http-errors");
const routes = require("./routes");
const { configureSocialAuth } = require("./services/socialAuthService");

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api/", apiLimiter);

// Request logging
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// Passport initialization
require("./config/passport")(passport);
app.use(passport.initialize());

// Static files
app.use("/uploads", express.static("public/uploads"));

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Anonymous Message API",
    documentation: process.env.API_DOCS_URL || "/api-docs",
  });
});

app.use(routes);
app.use(require("./middlewares/errorMiddleware").globalErrorHandler);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  next(createError.NotFound("Endpoint not found"));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: "error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

configureSocialAuth();

module.exports = app;
