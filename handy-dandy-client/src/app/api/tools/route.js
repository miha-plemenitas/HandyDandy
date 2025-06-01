import { connectDB } from "@/utils/db";
import Tool from "@/models/Tool";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Pridobi vse toolse
export async function GET(req) {
  await connectDB();
  try {
    const tools = await Tool.find().sort({ createdAt: -1 });
    return Response.json(tools);
  } catch (err) {
    console.error("GET error:", err);
    return Response.json({ error: "Error fetching tools." }, { status: 500 });
  }
}

// Dodaj nov tool
export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { name, category, link, image } = await req.json();
    const newTool = await Tool.create({
      name,
      category,
      link: link || "",
      image: image || "",
      user: session.user.id // <- DODAJ user ID!
    });
    return Response.json(newTool, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Error saving tool." }, { status: 400 });
  }
}

// Uredi obstoječ tool po ID-ju (?id=...)
export async function PUT(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const updateData = await req.json();

  if (!session?.user?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!id) {
    return Response.json({ error: "Missing tool ID" }, { status: 400 });
  }

  const tool = await Tool.findById(id);
  if (!tool) {
    return Response.json({ error: "Tool not found" }, { status: 404 });
  }
  if (tool.user.toString() !== session.user.id) {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  Object.assign(tool, updateData);
  await tool.save();

  return Response.json(tool);
}

// Izbriši tool po ID-ju (?id=...)
export async function DELETE(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!session?.user?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!id) {
    return Response.json({ error: "Missing tool ID" }, { status: 400 });
  }

  const tool = await Tool.findById(id);
  if (!tool) {
    return Response.json({ error: "Tool not found" }, { status: 404 });
  }
  if (tool.user.toString() !== session.user.id) {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  await tool.deleteOne();
  return Response.json({ message: "Tool deleted successfully" });
}

