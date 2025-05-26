import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  recommendedStores: [String],
  category: String,
});

export default mongoose.models.Tool || mongoose.model("Tool", toolSchema);
