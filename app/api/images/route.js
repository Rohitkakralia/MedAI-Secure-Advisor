// app/api/images/route.js
import connectDB from "@/db/connectDb";
import Image from "@/models/Image";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  await connectDB();

  // Using getServerSession (requires authOptions)
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Adjust according to your session structure
  const userId = session.user.id || session.user._id;
  if (!userId) {
    return NextResponse.json({ error: "User id is not available in session" }, { status: 400 });
  }

  try {
    const images = await Image.find({ user: userId }).sort({ uploadDate: -1 });
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images: " + error.message }, { status: 500 });
  }
}
