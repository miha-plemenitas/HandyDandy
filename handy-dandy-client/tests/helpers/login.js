import { request } from "@playwright/test";

export async function login(page, baseURL) {
  // 1. Pokliči naš test-login endpoint
  const req = await request.newContext();
  const response = await req.post(`${baseURL}/api/auth/test-login`, {});
  const { token } = await response.json();

  // 2. Nastavi next-auth-session cookie
  await page.context().addCookies([
    {
      name: "next-auth.session-token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // 3. Odpri aplikacijo – uporabnik že prijavljen
  await page.goto("/");
}
