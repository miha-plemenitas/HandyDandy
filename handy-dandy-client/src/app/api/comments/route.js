import { connectDB } from "@/utils/db";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const data = await req.json();
    // Obvezna polja iz sheme
    const { guideId, content, rating, parentCommentId } = data;

    if (!guideId || !content) {
      return Response.json({ error: "Missing guideId or content." }, { status: 400 });
    }

    // Zapiši komentar z userId iz session
    const comment = await Comment.create({
      guideId,
      userId: session.user.id,
      content,
      rating,
      authorName: session.user.name || "Unknown",
      createdAt: new Date(),
      parentCommentId: parentCommentId || null
    });

    // Vrni cel komentar (ali samo ID, po želji)
    return Response.json({ comment }, { status: 201 });
  } catch (e) {
    return Response.json({ error: "Error saving comment." }, { status: 400 });
  }
}

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");
  try {
    const comments = await Comment.find({ guideId }).sort({ createdAt: 1 });
    return Response.json({ comments });
  } catch {
    return Response.json(
      { error: "Error fetching comments." },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("id");
    if (!commentId) {
      return Response.json({ error: "Missing comment id." }, { status: 400 });
    }
    // Poišči komentar
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return Response.json({ error: "Comment not found." }, { status: 404 });
    }
    // Dovoli brisanje le svojemu avtorju
    if (comment.userId !== session.user.id) {
      return Response.json({ error: "Forbidden." }, { status: 403 });
    }
    await comment.deleteOne();
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: "Error deleting comment." }, { status: 500 });
  }
}