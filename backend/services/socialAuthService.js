const { User } = require("../models");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");
const passport = require("passport");
const { generateToken, generateRefreshToken } = require("./authService");

/**
 * Configure social authentication strategies
 */
exports.configureSocialAuth = () => {
  // Facebook Strategy
  if (process.env.FACEBOOK_APP_ID) {
    const FacebookStrategy = require("passport-facebook").Strategy;

    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
          profileFields: ["id", "emails", "name", "displayName"],
          passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            const user = await this.handleSocialLogin(profile, "facebook");
            done(null, user);
          } catch (err) {
            done(err, null);
          }
        }
      )
    );
  }

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID) {
    const GoogleStrategy = require("passport-google-oauth20").Strategy;

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
          scope: ["profile", "email"],
          passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            const user = await this.handleSocialLogin(profile, "google");
            done(null, user);
          } catch (err) {
            done(err, null);
          }
        }
      )
    );
  }
};

/**
 * Handle social login/registration
 */
exports.handleSocialLogin = async (profile, provider) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new AppError(`No email provided by ${provider}`, 400);
  }

  const providerField = `${provider}Id`;
  const providerName =
    profile.displayName ||
    `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim();

  try {
    // 1. Check if user exists with this social ID
    let user = await User.findOne({
      where: { [providerField]: profile.id },
    });

    if (user) return user;

    // 2. Check if email exists in system (account merging)
    user = await User.findOne({ where: { email } });

    if (user) {
      // Link social account to existing user
      user[providerField] = profile.id;
      await user.save();
      return user;
    }

    // 3. Create new user
    return await User.create({
      username: providerName || email.split("@")[0],
      email,
      [providerField]: profile.id,
      isActive: true,
      isVerified: true,
    });
  } catch (error) {
    logger.error(`${provider} authentication failed:`, error);
    throw new AppError(`${provider} authentication failed`, 500);
  }
};

/**
 * Generate auth response after successful social login
 */
exports.generateSocialAuthResponse = (user, res) => {
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Set secure cookies
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "lax",
  });

  return {
    status: "success",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Get social auth URLs for frontend
 */
exports.getSocialAuthUrls = () => {
  const urls = {};

  if (process.env.FACEBOOK_APP_ID) {
    urls.facebook = `${process.env.BACKEND_URL}/api/auth/facebook`;
  }

  if (process.env.GOOGLE_CLIENT_ID) {
    urls.google = `${process.env.BACKEND_URL}/api/auth/google`;
  }

  return urls;
};
