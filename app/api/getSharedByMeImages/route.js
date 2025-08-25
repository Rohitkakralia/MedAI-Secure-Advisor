// file: app/api/getSharedByMeImages/route.js

import connectDB from "@/db/connectDb";
import SharedImage from "@/models/SharedImage";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {


    // Connect to the database
    await connectDB();
    console.log("DB connected");

    // Parse request body
    const { senderId } = await req.json();
    console.log("Request received to get shared images for sender:", senderId);

    // Validate input
    if (!senderId) {
      return NextResponse.json({ error: "Sender ID is required" }, { status: 400 });
    }

    // Find all shared images by this user
    const sharedImages = await SharedImage.find({ sender: senderId })
      .sort({ sharedAt: -1 })
      .lean();

    console.log("Fetched shared images:", sharedImages);

    // Format for response (convert ObjectId and dates to strings)
    const formattedImages = sharedImages.map(image => ({
      ...image,
      _id: image._id.toString(),
      sender: image.sender.toString(),
      receiver: image.receiver.toString(),
      imageId: image.imageId.toString(),
      sharedAt: image.sharedAt.toISOString(),
    }));

    console.log("Formatted shared images:", formattedImages);

    // Return response
    return NextResponse.json(formattedImages, { status: 200 });

  } catch (error) {
    console.error("Error fetching shared images:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared images: " + error.message },
      { status: 500 }
    );
  }
}
