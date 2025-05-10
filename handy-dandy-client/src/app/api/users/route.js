// src/app/api/users/route.js
import { connectDB } from "@/utils/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  try {
    const users = await User.find().select("-password");
    return Response.json(users);
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { username, email } = await req.json();
    if (!username || !email)
      return Response.json({ message: "Missing fields" }, { status: 400 });

    const existing = await User.findOne({ email });
    if (existing)
      return Response.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );

    const newUser = await User.create({ username, email, password: "" });
    return Response.json(
      { message: "User added successfully", user: newUser },
      { status: 201 }
    );
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id, username, email } = await req.json();
    if (!id || !username || !email)
      return Response.json(
        { message: "Missing user ID or fields" },
        { status: 400 }
      );

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id)
    return Response.json({ message: "Missing user ID" }, { status: 400 });

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted)
      return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json({ message: "User deleted successfully" });
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
