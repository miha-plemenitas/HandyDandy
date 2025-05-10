import { connectDB } from '@/utils/db';
import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guideId: { type: String, required: true },
  currentStep: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  badgeEarned: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

export async function POST(req) {
  await connectDB();
  try {
    const { userId, guideId, currentStep, completed, badgeEarned } = await req.json();
    let record = await Progress.findOne({ userId, guideId });

    if (record) {
      Object.assign(record, { currentStep, completed, badgeEarned, updatedAt: new Date() });
      await record.save();
      return Response.json({ message: 'Progress updated.' });
    }

    await Progress.create({ userId, guideId, currentStep, completed, badgeEarned });
    return Response.json({ message: 'Progress saved.' }, { status: 201 });
  } catch {
    return Response.json({ error: 'Error saving progress.' }, { status: 400 });
  }
}

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  try {
    const progress = await Progress.find({ userId });
    return Response.json(progress);
  } catch {
    return Response.json({ error: 'Error fetching progress.' }, { status: 500 });
  }
}

