import connectDB from '@/db/connectDb';
import User from '@/models/User';

export async function PUT(req) {
    // Connect to database
    await connectDB();
    try {
      // Parse request body
      const body = await req.json();
      const { email, userType, doctorInfo } = body;
  
      // Validate required fields
      if (!email) {
        return new Response(
          JSON.stringify({ success: false, message: 'Email is required' }),
          { status: 400 }
        );
      }
  
      if (!userType || !['doctor', 'patient'].includes(userType)) {
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid user type' }),
          { status: 400 }
        );
      }
  
      // For doctors, validate required doctor info
      if (userType === 'doctor') {
        if (!doctorInfo?.fullName || !doctorInfo?.specialty) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'Full name and specialty are required for doctors' 
            }),
            { status: 400 }
          );
        }
      }
  
      // Prepare update data
      const updateData = {
        role: userType,
        onboardingCompleted: true,
        updatedAt: new Date()
      };

      // If user is a doctor, add doctor-specific information directly to User model
      if (userType === 'doctor') {
        updateData.name = doctorInfo.fullName || '';
        updateData.specialty = doctorInfo.specialty || '';
        updateData.licenseNumber = doctorInfo.licenseNumber || '';
        updateData.Hospital_Affiliation = doctorInfo.hospital || '';
        updateData.Years_in_Practice = doctorInfo.Years_in_Practice || 0;
        updateData.mobile = doctorInfo.Mobile || '';
      }
  
      // Update or create user
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        updateData,
        { 
          new: true, // Return updated document
          upsert: true, // Create if doesn't exist
          runValidators: true // Run schema validators
        }
      );
  
      if (!updatedUser) {
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to update user' }),
          { status: 500 }
        );
      }
  
      // Return success response (exclude sensitive data)
      const responseUser = {
        email: updatedUser.email,
        role: updatedUser.role,
        onboardingCompleted: updatedUser.onboardingCompleted,
        name: updatedUser.name,
        specialty: updatedUser.specialty,
        licenseNumber: updatedUser.licenseNumber,
        Hospital_Affiliation: updatedUser.Hospital_Affiliation,
        Years_in_Practice: updatedUser.Years_in_Practice,
        mobile: updatedUser.mobile
      };
  
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'User information updated successfully', 
          user: responseUser 
        }),
        { status: 200 }
      );
  
    } catch (error) {
      console.error('API Error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Server error', 
          error: error.message 
        }),
        { status: 500 }
      );
    }
  }