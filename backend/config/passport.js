const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { User } = require("../models");
const logger = require("../utils/logger");

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => req.cookies?.jwt,
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);
      if (!user) return done(null, false);
      if (!user.isActive)
        return done(null, false, { message: "Account disabled" });
      return done(null, user);
    } catch (err) {
      logger.error("JWT Strategy Error:", err);
      return done(err, false);
    }
  })
);

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
        profileFields: ["id", "emails", "name"],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email)
            return done(null, false, { message: "Email not provided" });

          let user = await User.findOne({ where: { facebookId: profile.id } });

          if (!user) {
            user = await User.findOne({ where: { email } });
            if (user) {
              // Link existing account
              user.facebookId = profile.id;
              await user.save();
            } else {
              // Create new account
              user = await User.create({
                username: `${profile.name.givenName} ${profile.name.familyName}`,
                email,
                facebookId: profile.id,
                isActive: true,
              });
            }
          }

          return done(null, user);
        } catch (err) {
          logger.error("Facebook Strategy Error:", err);
          return done(err);
        }
      }
    )
  );
}

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email)
            return done(null, false, { message: "Email not provided" });

          let user = await User.findOne({ where: { googleId: profile.id } });

          if (!user) {
            user = await User.findOne({ where: { email } });
            if (user) {
              // Link existing account
              user.googleId = profile.id;
              await user.save();
            } else {
              // Create new account
              user = await User.create({
                username: profile.displayName,
                email,
                googleId: profile.id,
                isActive: true,
              });
            }
          }

          return done(null, user);
        } catch (err) {
          logger.error("Google Strategy Error:", err);
          return done(err);
        }
      }
    )
  );
}

module.exports = passport;
