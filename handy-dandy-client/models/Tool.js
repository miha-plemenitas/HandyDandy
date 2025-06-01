import mongoose from "mongoose";

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  link: String,
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.models.Tool || mongoose.model("Tool", ToolSchema);
