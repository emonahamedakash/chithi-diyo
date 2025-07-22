const jwt = require("jsonwebtoken");
const db = require("../config/db");
// const { User } = require("../models");
// const { generateToken, generateRefreshToken } = require("../utils/auth");
// const { sendEmail } = require("../services/emailService");
// const AppError = require("../utils/appError");
// const {
//   handleSocialLogin,
//   generateSocialAuthResponse,
// } = require("../services/socialAuthService");

// Register new user
const register = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;
    console.log("Req.Body: ", req.body);

    if ((!user_name, !email, !password)) {
      return res.status(400).json({
        flag: "FAIL",
        message: "User name, email or password missing",
      });
    }

    const checkExistingUser = await db("users")
      .select("*")
      .where("email", email)
      .first();

    console.log("Check Existing User: ", checkExistingUser);

    if (checkExistingUser) {
      return res.status(409).json({
        flag: "FAIL",
        message: "User already exist",
      });
    }
    const currentDate = new Date();

    const newUser = await db("users").insert({
      user_name,
      email,
      password,
      created_at: currentDate,
    });

    console.log("New user: ", newUser);

    if (!newUser) {
      return res.status(500).json({
        flag: "FAIL",
        message: "Could not able to insert into db",
      });
    }

    res.status(201).json({
      flag: "SUCCESS",
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      flag: "FAIL",
      message: "Something went wrong in the server",
    });
  }
};
// Login
const login = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      flag: "FAIL",
      message: "Email and password required...",
    });
  }
  try {
    console.log("Req.body: ", req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        flag: "FAIL",
        message: "Email and password are required.",
      });
    }

    // Find user in DB
    const user = await db("users")
      .select("id", "email", "password")
      .where("email", email)
      .first();

    console.log(user);

    if (!user) {
      return res.status(401).json({
        flag: "FAIL",
        message: "Invalid credentials.",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        flag: "FAIL",
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.status(200).json({
      flag: "SUCCESS",
      message: "Logged in successfully.",
      user: {
        token,
        id: user.id,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      flag: "FAIL",
      message: "Internal server error.",
    });
  }
};

//Check is Logged in
const checkLoginState = async (req, res) => {
  if (!req.query) {
    return res.send(400).json({
      flag: "FAIL",
      message: "Id and token required",
    });
  }
  try {
    console.log("Req.query: ", req.query);
    console.log("Req.params: ", req.params);
    console.log("Req.body: ", req.body);
    const { id, token } = req.query;

    const user = await db("users").select("*").where("id", id).first();

    if (!user) {
      return res.status(404).json({
        flag: "FAIL",
        message: "No user found",
      });
    }

    if (user.token === null) {
      return res.status(404).json({
        flag: "FAIL",
        message: "No token found",
      });
    }
    if (user.token !== token) {
      return res.status(401).json({
        flag: "FAIL",
        message: "Token not matched",
      });
    }
    res.status(200).json({
      flag: "SUCCESS",
      message: "Token Matched",
    });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({
      flag: "FAIL",
      message: "Something went wrong",
    });
  }
};
// exports.register = async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       throw new AppError("Email already in use", 400);
//     }

//     // Create user
//     const user = await User.create({ username, email, password });

//     // Generate tokens
//     const token = generateToken(user.id);
//     const refreshToken = generateRefreshToken(user.id);

//     // Set cookies
//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     // Send welcome email
//     await sendEmail({
//       email: user.email,
//       subject: "Welcome to Anonymous Messages",
//       template: "welcome",
//       context: { username: user.username },
//     });

//     res.status(201).json({
//       status: "success",
//       data: {
//         user: {
//           id: user.id,
//           username: user.username,
//           email: user.email,
//           role: user.role,
//         },
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// Login user
// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ where: { email } });
//     if (!user || !(await user.comparePassword(password))) {
//       throw new AppError("Invalid email or password", 401);
//     }

//     if (!user.isActive) {
//       throw new AppError("Account is disabled", 403);
//     }

//     // Update last login
//     user.lastLogin = new Date();
//     await user.save();

//     // Generate tokens
//     const token = generateToken(user.id);
//     const refreshToken = generateRefreshToken(user.id);

//     // Set cookies
//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(200).json({
//       status: "success",
//       data: {
//         user: {
//           id: user.id,
//           username: user.username,
//           email: user.email,
//           role: user.role,
//         },
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// Social authentication callback
// exports.socialAuthCallback = async (req, res) => {
//   const token = generateToken(req.user.id);
//   const refreshToken = generateRefreshToken(req.user.id);

//   res.cookie("jwt", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 24 * 60 * 60 * 1000,
//   });

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   res.redirect(
//     process.env.FRONTEND_AUTH_REDIRECT || "http://localhost:3000/auth/success"
//   );
// };

// Logout user
// exports.logout = (req, res) => {
//   res.clearCookie("jwt");
//   res.clearCookie("refreshToken");
//   res
//     .status(200)
//     .json({ status: "success", message: "Logged out successfully" });
// };

// Refresh token
// exports.refreshToken = async (req, res, next) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) throw new AppError("No refresh token provided", 401);

//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const user = await User.findByPk(decoded.id);
//     if (!user) throw new AppError("User not found", 404);

//     const newToken = generateToken(user.id);

//     res.cookie("jwt", newToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({ status: "success", token: newToken });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.socialAuthCallback = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const response = generateSocialAuthResponse(user, res);
//     res.redirect(
//       `${process.env.FRONTEND_URL}/auth/success?token=${response.token}`
//     );
//   } catch (err) {
//     next(err);
//   }
// };

module.exports = {
  register,
  login,
  checkLoginState,
};
