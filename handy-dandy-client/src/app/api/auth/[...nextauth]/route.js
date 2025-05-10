// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/utils/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      await connectDB();
      const existingUser = await User.findOne({ email: profile.email });
      if (!existingUser) {
        await User.create({
          username: profile.name,
          email: profile.email,
          password: "",
        });
      }
      return true;
    },
    async session({ session }) {
      await connectDB();
      const user = await User.findOne({ email: session.user.email });
      session.user.id = user._id.toString(); // ✅ changed from _id to id
      return session;
    },
  },
  secret: process.env.SESSION_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
