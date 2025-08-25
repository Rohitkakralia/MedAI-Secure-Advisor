import { NextResponse } from "next/server";
import connectDB from "@/db/connectDb";
import Image from "@/models/Image";
import axios from "axios";

export async function DELETE(req) {
  await connectDB();
  console.log("DB connected");
  
  try {
    console.log("Request received to delete image");
    const { imageId } = await req.json(); 
    console.log("Request received to delete image with ID:", imageId);

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    // Find the image in the database
    const image = await Image.findById(imageId);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    console.log("Deleting Image:", image);

    // Delete the file from Pinata (IPFS)
    const pinataResponse = await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${image.hash}`,
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );

    console.log("Pinata response:", pinataResponse.data);

    // Delete the image record from MongoDB
    await Image.findByIdAndDelete(imageId);
    console.log("Image deleted from database");

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Failed to delete image: " + error.message }, { status: 500 });
  }
}
