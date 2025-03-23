// routes/comments.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Comment schema and model
const commentSchema = new mongoose.Schema({
  guideId: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

// POST /api/comments - add a new comment
router.post("/", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const saved = await newComment.save();
    res.status(201).json({ id: saved._id });
  } catch (err) {
    res.status(400).json({ error: "Error saving comment." });
  }
});

// GET /api/comments/:guideId - get all comments for a guide
router.get("/:guideId", async (req, res) => {
  try {
    const guideComments = await Comment.find({ guideId: req.params.guideId });
    res.json(guideComments);
  } catch (err) {
    res.status(500).json({ error: "Error fetching comments." });
  }
});

module.exports = router;