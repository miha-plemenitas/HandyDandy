const express = require("express");
const passport = require("passport");
const fetch = require("node-fetch");
const User = require("../models/User");

const router = express.Router();

// Middleware
const verifySession = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated via session" });
};

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add user
router.post("/add", verifySession, async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    const newUser = await User.create({ username, email, password: "" });

    // Notify
    await fetch("http://localhost:5001/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `New user added: ${username}` }),
    });

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user
router.put("/update", verifySession, async (req, res) => {
  try {
    const { id, username, email } = req.body;
    if (!id || !username || !email)
      return res.status(400).json({ message: "Missing user ID or fields" });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/delete/:id", verifySession, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Missing user ID" });

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated via session" });
  }
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
