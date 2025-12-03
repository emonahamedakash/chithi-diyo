const jwt = require("jsonwebtoken");
const { chithi } = require("../../config/db");

const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Register new user
const register = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    if ((!user_name, !email, !password)) {
      return res.status(400).json({
        success: false,
        message: "User name, email or password missing",
      });
    }

    const checkExistingUser = await chithi("users")
      .select("*")
      .where("email", email)
      .first();

    if (checkExistingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exist",
      });
    }
    const currentDate = new Date();

    const newUser = await chithi("users").insert({
      user_name,
      email,
      password,
      created_at: currentDate,
    });

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: "Could not able to insert into db",
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong in the server",
    });
  }
};
// Login
const login = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Email and password required...",
    });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user in DB
    const user = await chithi("users")
      .where("email", email)
      .select("*")
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user exist",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key"
    );

    const updateResult = await chithi("users")
      .where("id", user.id)
      .update({ token: token });

    if (updateResult === 0) {
      throw new Error("Failed to update user token");
    }

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        token,
        id: user.id,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//Check is Logged in
const checkLoginState = async (req, res) => {
  try {
    const { id, token } = req.query;

    if (!id || !token) {
      return res.status(400).json({
        success: false,
        message: "ID and token are required as query parameters",
      });
    }

    // Find user in database
    const user = await chithi("users").where("id", parseInt(id)).select("*");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check token existence
    if (!user.token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token found for this user",
      });
    }

    // Verify token match
    if (user.token !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Token is valid
    return res.status(200).json({
      success: true,
      message: "Authentication token is valid",
      user: {
        id: user.id,
      },
    });
  } catch (err) {
    console.error("Error in checkLoginState:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Store reset tokens (use Redis in production)
const resetTokens = new Map();

const forgotPassword = async (req, res) => {
  const { email, token, newPassword, action } = req.body;

  try {
    // Step 1: Request password reset link
    if (action === "request_reset") {
      const user = await chithi("users").where({ email }).first();

      if (!user) {
        // Don't reveal if user exists for security
        return res.status(200).json({
          success: true,
          message: "If the email exists, a reset link has been sent",
        });
      }

      // Generate unique token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

      // Store token with user email
      resetTokens.set(resetToken, {
        email: email,
        expiry: tokenExpiry,
      });

      // Create reset link with token
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      // Send email with reset link
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>You requested to reset your password. Click the button below to proceed:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: #4F46E5; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${resetLink}</p>
            <p>This link will expire in 15 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        message: "Password reset link sent to your email",
      });
    }

    // Step 2: Verify token and reset password
    if (action === "reset_password") {
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Token and new password are required",
        });
      }

      // Verify token
      const tokenData = resetTokens.get(token);

      if (!tokenData) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset link",
        });
      }

      if (Date.now() > tokenData.expiry) {
        resetTokens.delete(token);
        return res.status(400).json({
          success: false,
          message: "Reset link has expired",
        });
      }

      // Update password (without hashing for now)
      await chithi("users").where({ email: tokenData.email }).update({
        password: newPassword, // Storing plain text - you'll hash this later
        updated_at: new Date().toISOString(),
      });

      // Remove used token
      resetTokens.delete(token);

      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    }

    // Step 3: Validate token (for frontend to check if token is valid)
    if (action === "validate_token") {
      const tokenData = resetTokens.get(token);

      if (!tokenData || Date.now() > tokenData.expiry) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset link",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Token is valid",
        email: tokenData.email,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { register, login, checkLoginState, forgotPassword };
