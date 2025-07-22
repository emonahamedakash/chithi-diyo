const express = require("express");
const router = express.Router();
const {
  register,
  login,
  checkLoginState,
} = require("../controllers/authController");
// const {
//   validateRequest,
//   sanitizeUserInput,
//   authLimiter,
// } = require("../middlewares");
const passport = require("passport");

// Register new user
router.post("/register", register);
router.post("/login", login);
router.get("/check-login-state", checkLoginState);
// router.post(
//   "/register",
//   authLimiter,
//   sanitizeUserInput,
//   validateRequest([
//     body("username").isLength({ min: 3, max: 50 }),
//     body("email").isEmail(),
//     body("password").isLength({ min: 8 }),
//   ]),
//   register
// );

// Login user
// router.post(
//   "/login",
//   authLimiter,
//   sanitizeUserInput,
//   validateRequest([body("email").isEmail(), body("password").exists()]),
//   login
// );

// Logout user
// router.get("/logout", logout);

// Refresh token
// router.get("/refresh", refreshToken);

// Social authentication routes
// router.get(
//   "/facebook",
//   passport.authenticate("facebook", { scope: ["email"] })
// );
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { session: false }),
//   socialAuthCallback
// );

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   socialAuthCallback
// );

// router.get("/api/auth/social/urls", (req, res) => {
//   const urls = getSocialAuthUrls();
//   res.json({ status: "success", data: urls });
// });

module.exports = router;
