const express = require("express");
const router = express.Router();
const {
  createMessageLink,
  getMessageLinks,
  getMessagesForLink,
  sendAnonymousMessage,
  toggleMessageLink,
} = require("../controllers/messageController");
const {
  protect,
  validateRequest,
  sanitizeMessage,
  messageLimiter,
} = require("../middlewares");

// Protected routes (require authentication)
router.use(protect);

// Create new message link
router.post(
  "/links",
  validateRequest([body("title").optional().isLength({ max: 100 })]),
  createMessageLink
);

// Get all message links for user
router.get("/links", getMessageLinks);

// Get messages for a specific link
router.get("/links/:linkId/messages", getMessagesForLink);

// Toggle message link status
router.patch("/links/:linkId/toggle", toggleMessageLink);

// Public route for sending anonymous messages
router.post(
  "/send/:uniqueLink",
  messageLimiter,
  sanitizeMessage,
  validateRequest([body("content").isLength({ min: 1, max: 5000 })]),
  sendAnonymousMessage
);

module.exports = router;
