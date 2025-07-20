const jwt = require("jsonwebtoken");
const { User } = require("../models");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");
const emailService = require("./emailService");

// Generate JWT token
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Generate refresh token
exports.generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

// Verify JWT token
exports.verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    logger.error("Token verification failed:", err.message);
    throw new AppError("Invalid or expired token", 401);
  }
};

// Register new user
exports.registerUser = async ({ username, email, password }) => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    // Create user
    const user = await User.create({ username, email, password });

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.username);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  } catch (err) {
    logger.error("User registration failed:", err);
    throw err;
  }
};

// Login user
exports.loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account is disabled", 403);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  } catch (err) {
    logger.error("User login failed:", err);
    throw err;
  }
};

// Handle social login
exports.handleSocialLogin = async (profile, provider) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email)
      throw new AppError("Email not provided by social provider", 400);

    const providerId = `${provider}Id`;
    const providerName =
      profile.displayName ||
      `${profile.name.givenName} ${profile.name.familyName}`;

    // Find user by provider ID
    let user = await User.findOne({ where: { [providerId]: profile.id } });

    if (!user) {
      // Check if email exists
      user = await User.findOne({ where: { email } });

      if (user) {
        // Link social account to existing user
        user[providerId] = profile.id;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          username: providerName,
          email,
          [providerId]: profile.id,
          isActive: true,
        });
      }
    }

    return user;
  } catch (err) {
    logger.error("Social login failed:", err);
    throw err;
  }
};
