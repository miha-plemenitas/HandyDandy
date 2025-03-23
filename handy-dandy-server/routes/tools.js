// routes/tools.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Tool schema and model
const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  recommendedStores: [String],
  category: String,
});

const Tool = mongoose.model("Tool", toolSchema);

// GET /api/tools - get all tools
router.get("/", async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tools." });
  }
});

// GET /api/tools/:id - get a specific tool by ID
router.get("/:id", async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ error: "Tool not found." });
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tool." });
  }
});

module.exports = router;