// file: app/api/revokeImageAccess/route.js

import { NextResponse } from "next/server";
import connectDB from "@/db/connectDb";
import SharedImage from "@/models/SharedImage";

export async function DELETE(req) {
  await connectDB();
  console.log("DB connected");

  try {
    console.log("Request received to delete image");

    const { imageId } = await req.json(); // ✅ matches frontend now
    console.log("Request received to delete image with ID:", imageId);

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    const image = await SharedImage.findById(imageId);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await SharedImage.findByIdAndDelete(imageId);
    console.log("Image deleted from database");

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Failed to delete image: " + error.message }, { status: 500 });
  }
}
