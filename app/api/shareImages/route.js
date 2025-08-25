// file: app/api/shareImages/route.js
import connectDB from "@/db/connectDb";
import SharedImage from "@/models/SharedImage";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { send } from "process";

export async function POST(request) {
  try {
    console.log("Request received for sharing image");
    console.log("Connecting to the database...");
    await connectDB();
    
    const { receiverId, receiverUsername, imageDetails } = await request.json();
    console.log("Receiver ID:", receiverId);
    console.log("Image Details:", imageDetails);

    if ( !receiverId || !imageDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const receiver = await User.findById(receiverId);
    
    if (!receiver) {
      return NextResponse.json({ error: " receiver not found" }, { status: 404 });
    }
    
    
    // Create shared image record
    const sharedImage = new SharedImage({
      sender: imageDetails.user,
      senderName: imageDetails.userName,
      receiver: receiverId,
      receiverName: receiverUsername,
      sharedAt: new Date(),
      imageId: imageDetails._id,
      fileName: imageDetails.fileName,
      hash: imageDetails.hash,
      iv: imageDetails.iv,
      patientName: imageDetails.patientName || "Not specified",
      patientAge: imageDetails.patientAge || 0,
      patientDisease: imageDetails.patientDisease || "Not specified",
      patientGender: imageDetails.patientGender || "Not specified",
      isRead: false,
      status: "shared"
    });
    
    // Save the shared image record
    await sharedImage.save();
    
    return NextResponse.json({
      success: true,
      message: "Image shared successfully",
      sharedImageId: sharedImage._id
    });
    
  } catch (error) {
    console.error("Error sharing image:", error);
    return NextResponse.json({ 
      error: "Failed to share image", 
      details: error.message 
    }, { status: 500 });
  }
}