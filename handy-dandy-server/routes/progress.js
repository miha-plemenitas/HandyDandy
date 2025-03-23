// routes/progress.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Progress schema and model
const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guideId: { type: String, required: true },
  currentStep: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  badgeEarned: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

const Progress = mongoose.model("Progress", progressSchema);

// POST /api/progress - save or update user progress
router.post("/", async (req, res) => {
  try {
    const { userId, guideId, currentStep, completed, badgeEarned } = req.body;

    const existing = await Progress.findOne({ userId, guideId });
    if (existing) {
      existing.currentStep = currentStep;
      existing.completed = completed;
      existing.badgeEarned = badgeEarned;
      existing.updatedAt = new Date();
      await existing.save();
      return res.json({ message: "Progress updated." });
    }

    const newProgress = new Progress({ userId, guideId, currentStep, completed, badgeEarned });
    await newProgress.save();
    res.status(201).json({ message: "Progress saved." });
  } catch (err) {
    res.status(400).json({ error: "Error saving progress." });
  }
});

// GET /api/progress/:userId - get all progress for a user
router.get("/:userId", async (req, res) => {
  try {
    const progressList = await Progress.find({ userId: req.params.userId });
    res.json(progressList);
  } catch (err) {
    res.status(500).json({ error: "Error fetching progress." });
  }
});

module.exports = router;