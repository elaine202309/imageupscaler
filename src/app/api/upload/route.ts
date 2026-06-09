import { NextRequest, NextResponse } from "next/server";
import { uploadImage, validateFile } from "@/lib/storage";

/**
 * POST /api/upload
 *
 * Upload an image file. Returns the URL of the stored image.
 * Supports: PNG, JPG, WEBP, HEIC — up to 25MB.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    // Validate file type and size
    const validation = validateFile({ type: file.type, size: file.size });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to storage (R2 or local)
    const result = await uploadImage(buffer, file.type);

    return NextResponse.json({
      url: result.url,
      size: result.size,
      name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}
