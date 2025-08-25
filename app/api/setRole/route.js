import connectDB from '@/db/connectDb';
import User from '@/models/User';

// Connect to database once
connectDB();

export async function PUT(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { email, userType } = body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404 }
      );
    }

    // Validate userType
    if (!['doctor', 'patient'].includes(userType)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid user type' }),
        { status: 400 }
      );
    }

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { role: userType },
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Attribute updated successfully', user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error', error: error.message }),
      { status: 500 }
    );
  }
}
