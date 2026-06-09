import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { validateFile } from "@/lib/storage";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const validation = validateFile({ type: file.type, size: file.size });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    let buffer = Buffer.from(await file.arrayBuffer());
    let uploadFilename = file.name;

    // Convert HEIC to PNG for fal.ai compatibility
    if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
      buffer = await sharp(buffer).png().toBuffer();
      uploadFilename = file.name.replace(/\.(heic|heif)$/i, ".png");
    }

    const ext = uploadFilename.split(".").pop() || "png";
    const filename = `uploads/${uuidv4()}.${ext}`;

    const blob = await put(filename, new Blob([buffer], { type: "image/png" }), { access: "public" });

    return NextResponse.json({
      url: blob.url,
      size: buffer.length,
      name: uploadFilename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 }
    );
  }
}
