import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ustvari unikatno ime datoteke
  const filename = Date.now() + "-" + file.name.replace(/\s/g, "_");
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, filename);

  // Shrani v /public/uploads
  await writeFile(filePath, buffer);

  // Vrni pot do slike, ki bo javno dostopna iz /uploads/...
  const url = "/uploads/" + filename;
  return NextResponse.json({ url });
}
