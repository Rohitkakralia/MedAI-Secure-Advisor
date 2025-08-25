import NextAuth from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import User from '@/models/User';
import mongoose from 'mongoose';
import connectDB from '@/db/connectDb';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile, email }) {
      console.log('SignIn callback triggered:', { user, account, profile, email });

      if (account.provider === 'google' || account.provider === 'github') {
        try {
          await connectDB();
          console.log('Database connected');

          // Determine email safely
          const userEmail = email || user?.email || profile?.email;
          if (!userEmail) {
            console.error('No email found for user.');
            return false; // Block sign-in if email is missing
          }

          let currentUser = await User.findOne({ email: userEmail });

          if (!currentUser) {
            console.log('Creating new user');
            currentUser = new User({
              email: userEmail,
              username: userEmail.split('@')[0],
              name: user?.name || profile?.name || userEmail.split('@')[0],
              provider: account.provider,
              // No need to manually set all fields — defaults from schema will apply
            });
            await currentUser.save();
            console.log('New user created:', currentUser);
          }

          return true; // Allow sign-in
        } catch (error) {
          console.error('Error during sign-in:', error);
          return false; // Block sign-in on error
        }
      }

      return true; // Allow other providers
    }
  }


};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }