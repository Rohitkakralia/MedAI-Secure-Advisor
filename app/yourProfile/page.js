"use client";
import React, { useState, useEffect } from 'react';
import { fetchPersonalDetails } from '../actions/fetchDetails';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const UserProfile = () => {
  const { data: session, status } = useSession();
  // State for user profile data
  const [profileData, setProfileData] = useState({
    qualification: '',
    bio: '',
    location: ''
  });
  
  // Starting with edit form open by default
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Only proceed if session is loaded and user is authenticated
    if (status === 'authenticated' && session?.user?.email) {
      const userEmail = session.user.email;
      console.log("User email:", userEmail);
      
      const fetchProfileData = async () => {
        try {
          setIsLoading(true);
          console.log("Fetching personal details for email:", userEmail);
          const response = await fetchPersonalDetails(userEmail);
          
          if (response) {
            setProfileData({
              qualification: response.qualification || '',
              bio: response.bio || '',
              location: response.location || ''
            });
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setMessage('Error loading profile data');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProfileData();
    } else if (status === 'unauthenticated') {
      // Handle unauthenticated state
      setIsLoading(false);
      setMessage('Please log in to view your profile');
    }
  }, [session, status]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setMessage('');
      console.log("Submitting profile data:", session?.user?.email, profileData);
      // Correct API endpoint to match backend
      const response = await fetch('/api/Editprofile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...profileData,
          email: session?.user?.email
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || 'Profile updated successfully!');
        // Keep edit form open after successful submission
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                {session?.user?.image ? (
                  <Image
                    src="/background.jpg"
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-500">
                      {session?.user?.name?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* User Info */}
          <div className="pt-20 pb-8 px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">{session?.user?.name || 'User'}</h1>
            <p className="text-gray-500 mt-1">{session?.user?.email || ''}</p>
            
            {message && (
              <div className={`p-4 mt-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
            
            <div className="mt-8">
              {/* Edit form is always shown */}
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                  <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={profileData.qualification}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your qualifications"
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your location"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                <Link href="/profile">
                <button
                    type="submit"
                    className="px-5 py-2.5  text-black rounded-lg hover: bg-white transition duration-200 shadow-md"
                  >
                    Cancel
                  </button>
                </Link>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;