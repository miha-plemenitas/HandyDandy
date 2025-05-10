import { connectDB } from '@/utils/db';
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  guideId: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export async function POST(req) {
  await connectDB();
  try {
    const data = await req.json();
    const comment = await Comment.create(data);
    return Response.json({ id: comment._id }, { status: 201 });
  } catch {
    return Response.json({ error: 'Error saving comment.' }, { status: 400 });
  }
}

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const guideId = url.searchParams.get('guideId');
  try {
    const comments = await Comment.find({ guideId });
    return Response.json(comments);
  } catch {
    return Response.json({ error: 'Error fetching comments.' }, { status: 500 });
  }
}
