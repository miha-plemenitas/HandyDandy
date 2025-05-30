import { connectDB } from "@/utils/db";
import Progress from "@/models/Progress";
import Badge from "@/models/Badge";
import User from "@/models/User";
import Guide from "@/models/Guide";

export async function POST(req) {
  await connectDB();

  try {
    const { userId, guideId, currentStep, completed } = await req.json();

    let record = await Progress.findOne({ userId, guideId });

    let badgeAlreadyAwarded = false;

    const badgeExists = await Badge.findOne({
      userId,
      title: { $regex: guideId, $options: "i" }, // to support old badge titles with guideId
    });

    if (badgeExists) badgeAlreadyAwarded = true;

    const guide = await Guide.findById(guideId);
    const guideTitle = guide?.title || `Guide ${guideId}`;

    if (record) {
      Object.assign(record, {
        currentStep,
        completed,
        badgeEarned: completed || badgeAlreadyAwarded,
        updatedAt: new Date(),
      });

      await record.save();

      if (completed && !badgeAlreadyAwarded) {
        const user = await User.findById(userId);
        if (user) {
          await Badge.create({
            userId: user._id,
            title: `Badge: ${guideTitle}`,
          });
        }

        record.badgeEarned = true;
        await record.save();
      }

      return Response.json({ message: "Progress updated." });
    }

    const newProgress = await Progress.create({
      userId,
      guideId,
      currentStep,
      completed,
      badgeEarned: completed || badgeAlreadyAwarded,
    });

    if (completed && !badgeAlreadyAwarded) {
      const user = await User.findById(userId);
      if (user) {
        await Badge.create({
          userId: user._id,
          title: `Badge: ${guideTitle}`,
        });
      }

      newProgress.badgeEarned = true;
      await newProgress.save();
    }

    return Response.json({ message: "Progress saved." }, { status: 201 });
  } catch (err) {
    console.error("Error saving progress:", err);
    return Response.json({ error: "Error saving progress." }, { status: 400 });
  }
}

export async function GET(req) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const progress = await Progress.find({ userId });
    return Response.json(progress);
  } catch (err) {
    console.error("Error fetching progress:", err);
    return Response.json(
      { error: "Error fetching progress." },
      { status: 500 }
    );
  }
}
