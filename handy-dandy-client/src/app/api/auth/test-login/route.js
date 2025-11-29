import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";

export async function POST() {
  // TEST USER SESSION (fake Google user)
  const testUser = {
    name: "Playwright Tester",
    email: "playwright@test.com",
    image: null,
  };

  // Encode JWT token that NextAuth understands
  const token = await encode({
    secret: process.env.NEXTAUTH_SECRET,
    token: {
      user: testUser,
      sub: "playwright-test-user",
      email: testUser.email,
    },
  });

  return NextResponse.json({
    token,
  });
}
