import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guideId: { type: String, required: true },
  currentStep: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  badgeEarned: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Progress ||
  mongoose.model("Progress", progressSchema);
