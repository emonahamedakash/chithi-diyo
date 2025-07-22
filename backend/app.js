const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
// const { configureSocialAuth } = require("./services/socialAuthService");

// Initialize Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// Static files
app.use("/uploads", express.static("public/uploads"));

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Chithi Diyo API",
    documentation: process.env.API_DOCS_URL || "/api-docs",
  });
});

app.use(routes);

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

// configureSocialAuth();

module.exports = app;
