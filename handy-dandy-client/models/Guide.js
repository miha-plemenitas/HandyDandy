import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
  title: String,
  description: String,
  steps: [String],
  images: [String],
  videoUrl: String,
  category: String,
  tools: [String],
  author: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Guide || mongoose.model("Guide", guideSchema);
