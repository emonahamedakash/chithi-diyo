const { MessageLink, AnonymousMessage } = require("../models");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");
const { getClientIp } = require("request-ip");

// Create new message link
exports.createMessageLink = async (userId, title) => {
  try {
    const messageLink = await MessageLink.create({
      title,
      userId,
    });

    return messageLink;
  } catch (err) {
    logger.error("Failed to create message link:", err);
    throw new AppError("Failed to create message link", 500);
  }
};

// Get user's message links
exports.getUserMessageLinks = async (userId) => {
  try {
    return await MessageLink.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "uniqueLink",
        "title",
        "isActive",
        "viewCount",
        "createdAt",
      ],
    });
  } catch (err) {
    logger.error("Failed to get message links:", err);
    throw new AppError("Failed to get message links", 500);
  }
};

// Get messages for a link
exports.getMessagesForLink = async (linkId, userId) => {
  try {
    // Verify ownership
    const messageLink = await MessageLink.findOne({
      where: { id: linkId, userId },
    });

    if (!messageLink) {
      throw new AppError("Message link not found or access denied", 404);
    }

    return await AnonymousMessage.findAll({
      where: { linkId },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "content", "isRead", "createdAt"],
    });
  } catch (err) {
    logger.error("Failed to get messages:", err);
    throw err;
  }
};

// Send anonymous message
exports.sendAnonymousMessage = async (uniqueLink, content, req) => {
  try {
    const messageLink = await MessageLink.findOne({
      where: { uniqueLink, isActive: true },
    });

    if (!messageLink) {
      throw new AppError("Invalid message link or link is disabled", 404);
    }

    // Increment view count
    messageLink.viewCount += 1;
    await messageLink.save();

    // Get sender info if configured
    const senderIp =
      process.env.STORE_IP_ADDRESSES === "true" ? getClientIp(req) : null;
    const userAgent =
      process.env.STORE_USER_AGENTS === "true"
        ? req.headers["user-agent"]
        : null;

    // Create message
    return await AnonymousMessage.create({
      content,
      linkId: messageLink.id,
      senderIp,
      userAgent,
    });
  } catch (err) {
    logger.error("Failed to send anonymous message:", err);
    throw err;
  }
};

// Toggle message link status
exports.toggleMessageLinkStatus = async (linkId, userId) => {
  try {
    const messageLink = await MessageLink.findOne({
      where: { id: linkId, userId },
    });

    if (!messageLink) {
      throw new AppError("Message link not found or access denied", 404);
    }

    messageLink.isActive = !messageLink.isActive;
    await messageLink.save();

    return messageLink.isActive;
  } catch (err) {
    logger.error("Failed to toggle message link:", err);
    throw err;
  }
};
