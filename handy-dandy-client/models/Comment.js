import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  guideId: { type: String, required: true },
  authorName: { type: String },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  parentCommentId: { type: String, default: null }
});

export default mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);

