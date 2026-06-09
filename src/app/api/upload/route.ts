import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
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

    const ext = file.name.split(".").pop() || "png";
    const filename = `uploads/${uuidv4()}.${ext}`;

    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({
      url: blob.url,
      size: file.size,
      name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 }
    );
  }
}
