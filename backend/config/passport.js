const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const db = require("../config/db"); // 👈 using knex now
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
      const user = await db("users").where({ id: payload.id }).first();
      if (!user) return done(null, false);
      if (!user.is_active)
        return done(null, false, { message: "Account disabled" });
      return done(null, user);
    } catch (err) {
      logger.error("JWT Strategy Error:", err);
      return done(err, false);
    }
  })
);

// Facebook Strategy
// if (process.env.FACEBOOK_APP_ID) {
//   passport.use(
//     new FacebookStrategy(
//       {
//         clientID: process.env.FACEBOOK_APP_ID,
//         clientSecret: process.env.FACEBOOK_APP_SECRET,
//         callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
//         profileFields: ["id", "emails", "name"],
//         passReqToCallback: true,
//       },
//       async (req, accessToken, refreshToken, profile, done) => {
//         try {
//           const email = profile.emails?.[0]?.value;
//           if (!email)
//             return done(null, false, { message: "Email not provided" });

//           let user = await db("users")
//             .where({ facebook_id: profile.id })
//             .first();

//           if (!user) {
//             user = await db("users").where({ email }).first();
//             if (user) {
//               // Link existing account
//               await db("users")
//                 .where({ id: user.id })
//                 .update({ facebook_id: profile.id });
//               user.facebook_id = profile.id;
//             } else {
//               // Create new account
//               const [newUserId] = await db("users").insert({
//                 username: `${profile.name.givenName} ${profile.name.familyName}`,
//                 email,
//                 facebook_id: profile.id,
//                 is_active: true,
//                 created_at: new Date(),
//                 updated_at: new Date(),
//               });
//               user = await db("users").where({ id: newUserId }).first();
//             }
//           }

//           return done(null, user);
//         } catch (err) {
//           logger.error("Facebook Strategy Error:", err);
//           return done(err);
//         }
//       }
//     )
//   );
// }

// Google Strategy
// if (process.env.GOOGLE_CLIENT_ID) {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
//         passReqToCallback: true,
//       },
//       async (req, accessToken, refreshToken, profile, done) => {
//         try {
//           const email = profile.emails?.[0]?.value;
//           if (!email)
//             return done(null, false, { message: "Email not provided" });

//           let user = await db("users").where({ google_id: profile.id }).first();

//           if (!user) {
//             user = await db("users").where({ email }).first();
//             if (user) {
//               // Link existing account
//               await db("users")
//                 .where({ id: user.id })
//                 .update({ google_id: profile.id });
//               user.google_id = profile.id;
//             } else {
//               // Create new account
//               const [newUserId] = await db("users").insert({
//                 username: profile.displayName,
//                 email,
//                 google_id: profile.id,
//                 is_active: true,
//                 created_at: new Date(),
//                 updated_at: new Date(),
//               });
//               user = await db("users").where({ id: newUserId }).first();
//             }
//           }

//           return done(null, user);
//         } catch (err) {
//           logger.error("Google Strategy Error:", err);
//           return done(err);
//         }
//       }
//     )
//   );
// }

module.exports = passport;
