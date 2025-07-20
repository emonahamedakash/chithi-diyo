const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const AppError = require("../utils/appError");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    logger.error("Email server connection failed:", error);
  } else {
    logger.info("Email server is ready");
  }
});

// Send welcome email
exports.sendWelcomeEmail = async (to, username) => {
  try {
    if (!process.env.EMAIL_HOST) return; // Skip if email not configured

    await transporter.sendMail({
      from: `"Anonymous Messages" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "Welcome to Anonymous Messages!",
      text: `Hi ${username},\n\nWelcome to Anonymous Messages! You can now create links to receive anonymous messages.\n\nHappy messaging!`,
      html: `<p>Hi ${username},</p>
             <p>Welcome to Anonymous Messages! You can now create links to receive anonymous messages.</p>
             <p>Happy messaging!</p>`,
    });
  } catch (err) {
    logger.error("Failed to send welcome email:", err);
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (to, resetToken) => {
  try {
    if (!process.env.EMAIL_HOST) return;

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Anonymous Messages" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>This link will expire in 1 hour.</p>`,
    });
  } catch (err) {
    logger.error("Failed to send password reset email:", err);
    throw new AppError("Failed to send password reset email", 500);
  }
};

// Send new message notification
exports.sendNewMessageNotification = async (to, username, linkTitle) => {
  try {
    if (!process.env.EMAIL_HOST) return;

    await transporter.sendMail({
      from: `"Anonymous Messages" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "You received a new anonymous message!",
      text: `Hi ${username},\n\nYou received a new anonymous message on your link "${linkTitle}".\n\nLogin to view your messages.`,
      html: `<p>Hi ${username},</p>
             <p>You received a new anonymous message on your link "${linkTitle}".</p>
             <p>Login to view your messages.</p>`,
    });
  } catch (err) {
    logger.error("Failed to send new message notification:", err);
  }
};
