"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Page = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login')
    }
  }, [status, router])

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }
  
  // If not authenticated and still on this page (before redirect completes)
  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-32 w-32 mb-4">
                <Image
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                  src="/background.jpg"
                  alt="User profile"
                  layout="fill"
                  priority
                />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800">
                {session.user.name}
              </h1>
              
              <p className="text-md text-gray-500 mt-1">
                {session.user.email}
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <span className="block text-sm font-medium text-gray-500">Member Since</span>
                  <span className="block mt-1 text-lg font-semibold">Jan 2023</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <span className="block text-sm font-medium text-gray-500">Status</span>
                  <span className="block mt-1 text-lg font-semibold">Active</span>
                </div>
              </div>
              
              <div className="mt-8 w-full">
                <Link href="/yourProfile">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                    Edit Profile
                  </button>
                </Link>
                
                <div className="mt-4 flex justify-center space-x-4">
                  <button className="text-gray-600 hover:text-blue-600 font-medium">
                    Settings
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-gray-600 hover:text-blue-600 font-medium">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page