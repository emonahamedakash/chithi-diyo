const express = require("express");
const router = express.Router();
const {
  getInbox,
  getMessageDetails,
  setMarkAsRead,
  deleteMessage
} = require("../controllers/message.controllers");

module.exports = (app, basePath = "/api") => {
  // All routes will be prefixed with basePath (e.g., /api/dokan-manager)
  router.get("/fetch-message-list", getInbox);
  router.get("/fetch-message-details", getMessageDetails);
  router.patch("/mark-as-read/:message_id", setMarkAsRead);
  router.delete("/delete-message/:message_id", deleteMessage);

  // Use the basePath for this specific app
  return app.use(basePath, router);
};
