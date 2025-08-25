// File: app/api/updateImageStatus/route.js
import { NextResponse } from "next/server";
import connectDB from "@/db/connectDb";
import SharedImage from "@/models/SharedImage";

// Handle PUT requests
export async function PUT(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { imageId, status } = body;
    
    console.log('Received data:', body);
    
    if (!imageId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();
    
    // Find the shared image
    const sharedImage = await SharedImage.findById(imageId);
    
    if (!sharedImage) {
      return NextResponse.json(
        { success: false, message: 'Shared image not found' },
        { status: 404 }
      );
    }
    
    // Validate the status value
    const validStatuses = ['shared', 'viewed', 'downloaded', 'deleted'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update the status
    sharedImage.status = status;
    
    // If status is 'viewed', also update isRead field
    if (status === 'viewed') {
      sharedImage.isRead = true;
    }
    
    // Save the changes
    await sharedImage.save();

    console.log('Updated shared image:', sharedImage.status, sharedImage.isRead);
    
    // Return success response
    return NextResponse.json({
      success: true, 
      message: 'Image status updated successfully',
      data: { 
        _id: sharedImage._id,
        status: sharedImage.status,
        isRead: sharedImage.isRead
      }
    });
    
  } catch (error) {
    console.error('Error updating image status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update image status', error: error.message },
      { status: 500 }
    );
  }
}