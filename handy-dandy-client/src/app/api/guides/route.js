import { connectDB } from '@/utils/db';
import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema({
  title: String,
  description: String,
  steps: [String],
  images: [String],
  videoUrl: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

const Guide = mongoose.models.Guide || mongoose.model('Guide', guideSchema);

export async function GET() {
  await connectDB();
  try {
    const guides = await Guide.find();
    return Response.json(guides);
  } catch {
    return Response.json({ error: 'Error fetching guides.' }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const newGuide = await Guide.create(body);
    return Response.json({ id: newGuide._id }, { status: 201 });
  } catch {
    return Response.json({ error: 'Error saving guide.' }, { status: 400 });
  }
}

