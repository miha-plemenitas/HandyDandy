// routes/guides.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Guide schema and model
const guideSchema = new mongoose.Schema({
  title: String,
  description: String,
  steps: [String],
  images: [String],
  videoUrl: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

const Guide = mongoose.model("Guide", guideSchema);

// GET /api/guides - fetch all guides
router.get("/", async (req, res) => {
  try {
    const guides = await Guide.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: "Error fetching guides." });
  }
});

// POST /api/guides - add a new guide
router.post("/", async (req, res) => {
  try {
    const newGuide = new Guide(req.body);
    const saved = await newGuide.save();
    res.status(201).json({ id: saved._id });
  } catch (err) {
    res.status(400).json({ error: "Error saving guide." });
  }
});

// DELETE /api/guides/:id - delete a guide
router.delete("/:id", async (req, res) => {
  try {
    await Guide.findByIdAndDelete(req.params.id);
    res.json({ message: "Guide deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Error deleting guide." });
  }
});

// GET /api/guides/offline - get list of guides marked as available offline
router.get("/offline", async (req, res) => {
  try {
    const offlineGuides = await Guide.find({ isOfflineAvailable: true });
    res.json(offlineGuides);
  } catch (err) {
    res.status(500).json({ error: "Error fetching offline guides." });
  }
});

module.exports = router;