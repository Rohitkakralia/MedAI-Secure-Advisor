// app/api/Editprofile/route.js
import connectDB from '@/db/connectDb';
import User from '@/models/User';

// Connect to database once
connectDB();

export async function PUT(req) {
  try {
    
    
    const data = await req.json();
    const { email } = data;
    const { qualification, bio, location } = data;
    
    console.log('Received data:', data);
    // Validate input
    if (bio && bio.length > 1000) {
      return new Response(JSON.stringify({ message: 'Bio must be less than 1000 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Find and update user, create if it doesn't exist
    let user = await User.findOne({ email: email });
    
    if (!user) {
      user = new User({ user });
    }
    
    // Update fields
    user.Qualification = qualification;
    user.bio = bio;
    user.location = location;
    user.updatedAt = Date.now();
    
    await user.save();
    
    console.log('User updated:', user);
    return new Response(JSON.stringify({ 
      message: 'Profile updated successfully',
      profile: {
        qualification: user.Qualification,
        bio: user.bio,
        location: user.location
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return new Response(JSON.stringify({ message: 'Server error while updating profile' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}