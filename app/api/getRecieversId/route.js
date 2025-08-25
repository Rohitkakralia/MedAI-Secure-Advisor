import connectDB from "@/db/connectDb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("Request received at /api/getRecieversId");
  
  // Parse the request body for POST requests
  const body = await request.json();
  const receiverEmail = body.receiverEmail;

  console.log("Receiver email:", receiverEmail);
  if (!receiverEmail) {
    return NextResponse.json({ error: "Receiver email is required" }, { status: 400 });
  }

  try {
    await connectDB();
    console.log("Connected to database");
    const receiver = await User.findOne({ email: receiverEmail });
    console.log("Receiver found:", receiver);
    
    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }
    
    console.log("Receiver ID:", receiver._id);
    console.log("Receiver username:", receiver.username);

    return NextResponse.json({
      receiverId: receiver._id,
      receiverUsername: receiver.username,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}