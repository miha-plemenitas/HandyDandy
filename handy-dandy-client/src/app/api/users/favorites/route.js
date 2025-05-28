import { connectDB } from "@/utils/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // prilagodi če je pot drugačna

// Vrne seznam ID-jev priljubljenih vodičev za prijavljenega uporabnika
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const user = await User.findOne({ email: session.user.email }).select("favorites");
  if (!user)
    return Response.json({ message: "User not found" }, { status: 404 });

  return Response.json({ favorites: user.favorites || [] });
}

// Posodobi seznam priljubljenih vodičev (zamenja celoten array)
export async function PATCH(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { favorites } = await req.json();
    if (!Array.isArray(favorites))
      return Response.json({ message: "Favorites must be an array" }, { status: 400 });

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { favorites },
      { new: true }
    ).select("favorites");

    if (!user)
      return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json({ message: "Favorites updated", favorites: user.favorites });
  } catch (err) {
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
