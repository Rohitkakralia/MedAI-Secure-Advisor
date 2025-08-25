'use client'
import { useSession, signIn } from "next-auth/react"
import React from "react"
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Shield, Lock } from "lucide-react"

const LoginPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()  // ✅ Extract username safely
  const username = session?.user?.email.split('@')[0]

  useEffect(() => {
    if (session) {
      router.push(`/${username}`)
    }
  }, [session, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-md z-10 p-1">
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="relative pt-12 pb-8 px-8 text-center">
            {/* Logo container */}
            <div className="bg-white dark:bg-slate-700 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-10 w-10 text-blue-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6">SecureVault</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Secure healthcare document management</p>
          </div>
        </div>
        
        <div className="px-8 pb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sign in to your account</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Access your encrypted healthcare documents securely</p>
          
          {/* Login methods */}
          <div className="space-y-4">
            <button
              onClick={() => signIn("google")}
              className="flex items-center justify-center w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 font-medium transition duration-150 ease-in-out shadow-sm"
            >
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Continue with Google
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">or</span>
              </div>
            </div>
            
            <button
              onClick={() => signIn("github")}
              className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 font-medium transition duration-150 ease-in-out shadow-sm"
            >
              <svg 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 24 24" 
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>
          
          {/* Security notes */}
          <div className="mt-8 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <Lock className="h-4 w-4 mr-1" />
            <span>End-to-end encrypted login</span>
          </div>
        </div>
      </div>
      
      {/* Bottom links */}
      <div className="absolute bottom-4 text-center text-xs text-gray-400 dark:text-gray-500">
        <div className="space-x-4">
          <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Help Center</a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

