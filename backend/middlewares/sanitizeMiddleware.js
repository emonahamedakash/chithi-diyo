const { body, param, query } = require("express-validator");

// Sanitize user input
exports.sanitizeUserInput = [
  body("username").trim().escape(),
  body("email").normalizeEmail(),
  body("password").trim(),
];

// Sanitize message content
exports.sanitizeMessage = [
  body("content").trim().escape().blacklist("<>{}[]"), // Remove potentially dangerous characters
];

// Sanitize URL parameters
exports.sanitizeParams = [
  param("id").trim().escape(),
  param("linkId").trim().escape(),
];

// Sanitize query parameters
exports.sanitizeQuery = [query("page").toInt(), query("limit").toInt()];
