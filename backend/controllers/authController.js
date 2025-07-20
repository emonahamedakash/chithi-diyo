const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { generateToken, generateRefreshToken } = require("../utils/auth");
const { sendEmail } = require("../services/emailService");
const AppError = require("../utils/appError");
const {
  handleSocialLogin,
  generateSocialAuthResponse,
} = require("../services/socialAuthService");

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    // Create user
    const user = await User.create({ username, email, password });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set cookies
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send welcome email
    await sendEmail({
      email: user.email,
      subject: "Welcome to Anonymous Messages",
      template: "welcome",
      context: { username: user.username },
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
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

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set cookies
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Social authentication callback
exports.socialAuthCallback = async (req, res) => {
  const token = generateToken(req.user.id);
  const refreshToken = generateRefreshToken(req.user.id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(
    process.env.FRONTEND_AUTH_REDIRECT || "http://localhost:3000/auth/success"
  );
};

// Logout user
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.clearCookie("refreshToken");
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new AppError("No refresh token provided", 401);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) throw new AppError("User not found", 404);

    const newToken = generateToken(user.id);

    res.cookie("jwt", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ status: "success", token: newToken });
  } catch (err) {
    next(err);
  }
};

exports.socialAuthCallback = async (req, res, next) => {
  try {
    const user = req.user;
    const response = generateSocialAuthResponse(user, res);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?token=${response.token}`
    );
  } catch (err) {
    next(err);
  }
};
