import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:admin@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(req) {
  const { message } = await req.json();
  // Ideally: fetch all subscriptions from DB
  console.log("📤 Simulated Push Notification:", message);
  return Response.json({ message: "Notification simulated." });
}
