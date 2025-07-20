const { MessageLink, AnonymousMessage } = require("../models");
const AppError = require("../utils/appError");
const { getClientIp } = require("request-ip");

// Create new message link
exports.createMessageLink = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    const messageLink = await MessageLink.create({
      title,
      userId,
    });

    res.status(201).json({
      status: "success",
      data: {
        messageLink,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get all message links for user
exports.getMessageLinks = async (req, res, next) => {
  try {
    const messageLinks = await MessageLink.findAll({
      where: { userId: req.user.id },
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

    res.status(200).json({
      status: "success",
      results: messageLinks.length,
      data: {
        messageLinks,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get messages for a specific link
exports.getMessagesForLink = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const userId = req.user.id;

    // Verify the link belongs to the user
    const messageLink = await MessageLink.findOne({
      where: { id: linkId, userId },
    });

    if (!messageLink) {
      throw new AppError("Message link not found or access denied", 404);
    }

    const messages = await AnonymousMessage.findAll({
      where: { linkId },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "content", "isRead", "createdAt"],
    });

    res.status(200).json({
      status: "success",
      data: {
        messages,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Send anonymous message
exports.sendAnonymousMessage = async (req, res, next) => {
  try {
    const { uniqueLink } = req.params;
    const { content } = req.body;

    // Find the message link
    const messageLink = await MessageLink.findOne({
      where: { uniqueLink, isActive: true },
    });

    if (!messageLink) {
      throw new AppError("Invalid message link or link is disabled", 404);
    }

    // Increment view count
    messageLink.viewCount += 1;
    await messageLink.save();

    // Get sender IP (optional)
    const senderIp =
      process.env.STORE_IP_ADDRESSES === "true" ? getClientIp(req) : null;
    const userAgent =
      process.env.STORE_USER_AGENTS === "true"
        ? req.headers["user-agent"]
        : null;

    // Create anonymous message
    const message = await AnonymousMessage.create({
      content,
      linkId: messageLink.id,
      senderIp,
      userAgent,
    });

    res.status(201).json({
      status: "success",
      message: "Message sent anonymously",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Toggle message link status
exports.toggleMessageLink = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const userId = req.user.id;

    const messageLink = await MessageLink.findOne({
      where: { id: linkId, userId },
    });

    if (!messageLink) {
      throw new AppError("Message link not found or access denied", 404);
    }

    messageLink.isActive = !messageLink.isActive;
    await messageLink.save();

    res.status(200).json({
      status: "success",
      data: {
        isActive: messageLink.isActive,
      },
    });
  } catch (err) {
    next(err);
  }
};
