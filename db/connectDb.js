import mongoose from 'mongoose'

const connectDB = async () => {
    try {
      const conn = await mongoose.connect("mongodb+srv://rohitkakraia94:Rohit123@cluster0.s8wtr.mongodb.net/SecureVault", {
        
      });
      console.log(`MongoDB Connected: {conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

  export default connectDB