import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import User from "@/models/User";
import Badge from "@/models/Badge";

export async function POST(req) {
  await connectDB();
  const { email, repairId } = await req.json();

  if (!email || !repairId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const newBadge = await Badge.create({
    userId: user._id,
    title: `Badge: ${repairId}`,
  });

  return NextResponse.json({ badge: newBadge }, { status: 200 });
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const badges = await Badge.find({ userId: user._id }).sort({ earnedAt: -1 });
  return NextResponse.json({ badges });
}
