export async function POST(req) {
  const body = await req.json();
  console.log("📬 New Push Subscription:", body);
  // Optional: save to DB
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
