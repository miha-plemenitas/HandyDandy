import { connectDB } from "@/utils/db";
import Guide from "@/models/Guide";

export async function GET(req) {
  await connectDB();
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });
    return Response.json(guides);
  } catch (err) {
    console.error("GET error:", err);
    return Response.json({ error: "Error fetching guides." }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const newGuide = await Guide.create(body);
    return Response.json(newGuide, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return Response.json({ error: "Error saving guide." }, { status: 400 });
  }
}

export async function PUT(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const updateData = await req.json();

    if (!id) {
      return Response.json({ error: "Missing guide ID" }, { status: 400 });
    }

    const updatedGuide = await Guide.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedGuide) {
      return Response.json({ error: "Guide not found" }, { status: 404 });
    }

    return Response.json(updatedGuide);
  } catch (err) {
    console.error("PUT error:", err);
    return Response.json({ error: "Error updating guide" }, { status: 400 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing guide ID" }, { status: 400 });
    }

    const deletedGuide = await Guide.findByIdAndDelete(id);

    if (!deletedGuide) {
      return Response.json({ error: "Guide not found" }, { status: 404 });
    }

    return Response.json({ message: "Guide deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    return Response.json({ error: "Error deleting guide" }, { status: 400 });
  }
}
