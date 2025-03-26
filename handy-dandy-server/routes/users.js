const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// ==================== AUTH MIDDLEWARE ====================

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

// Google OAuth session middleware
const verifySession = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated via session" });
};

// Combined middleware: allow access via either JWT or OAuth session
const dualAuth = async (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    req.user = req.user._id || req.user.id;
    return next();
  }
  return verifyToken(req, res, next);
};

// ==================== ROUTES ====================

// Register User (JWT)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login User (JWT)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user info (JWT only)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user (JWT or OAuth session)
router.put("/update", dualAuth, async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username && !email) {
      return res
        .status(400)
        .json({ message: "Provide username or email to update." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { username, email },
      { new: true }
    ).select("-password");

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (JWT or OAuth session)
router.delete("/delete", dualAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ========== GOOGLE OAUTH ROUTES ==========

// Start Google OAuth flow
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json({
      message: "✅ Google OAuth login successful",
      user: req.user,
    });
  }
);

// Get user session info (OAuth)
router.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated via session" });
  }
});

// Test protected route (OAuth only)
router.get("/protected-oauth", verifySession, (req, res) => {
  res.json({
    message: "✅ You are authenticated via Google OAuth!",
    user: req.user,
  });
});

module.exports = router;
