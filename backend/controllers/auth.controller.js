const jwt = require("jsonwebtoken");
const db = require("../config/db");

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
  console.log("Hit Login Endpoint");

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
    const user = await db("users").where("email", email).select("*").first();

    console.log("Response from DB: ", user);

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

    // FIXED: Proper token insertion syntax
    const updateResult = await db("users")
      .where("id", user.id)
      .update({ token: token });

    console.log("Update result: ", updateResult);

    if (updateResult === 0) {
      // Check if update was successful
      throw new Error("Failed to update user token");
    }

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
  try {
    console.log("Req.query: ", req.query);
    const { id, token } = req.query;

    if (!id || !token) {
      return res.status(400).json({
        flag: "FAIL",
        message: "ID and token are required as query parameters",
      });
    }

    // Find user in database
    const user = await db("users").where("id", parseInt(id)).select("*");

    console.log(user);

    if (!user) {
      return res.status(404).json({
        flag: "FAIL",
        message: "User not found",
      });
    }

    // Check token existence
    if (!user.token) {
      return res.status(401).json({
        flag: "FAIL",
        message: "No authentication token found for this user",
      });
    }

    // Verify token match
    if (user.token !== token) {
      return res.status(401).json({
        flag: "FAIL",
        message: "Invalid authentication token",
      });
    }

    // Token is valid
    return res.status(200).json({
      flag: "SUCCESS",
      message: "Authentication token is valid",
      user: {
        id: user.id,
      },
    });
  } catch (err) {
    console.error("Error in checkLoginState:", err);
    return res.status(500).json({
      flag: "FAIL",
      message: "Internal server error",
    });
  }
};

module.exports = { register, login, checkLoginState };
