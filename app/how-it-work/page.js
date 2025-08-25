"use client"
import { useState } from "react";
import { Shield, Lock, Upload, Share, RefreshCw, Database, Key } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 pb-48 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
        How Secure Vault Works
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
        Discover how our encrypted storage solution keeps your sensitive data protected while remaining easy to use.
      </p>
    </div>
  </div>

  {/* Fixed Wave Alignment and Background Overlap */}
  <div className="absolute bottom-0 w-full">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto" >
      <path 
        fill="#ffffff" 
        fillOpacity="1" 
        d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,133.3C960,160,1056,192,1152,186.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z"
        className="dark:fill-slate-900"
      ></path>
    </svg>
  </div>
</div>



      {/* Features Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Three-Step Process
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Keeping your data secure doesn't have to be complicated
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center bg-gray-50 dark:bg-slate-800 rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              1. Upload Your Files
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Simply drag and drop your files or select them from your device. Our system accepts all file types with generous size limits.
            </p>
            <div className="mt-auto pt-4">
              <Image 
                src="/api/placeholder/300/160" 
                alt="Upload process illustration" 
                width={300} 
                height={160} 
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center bg-gray-50 dark:bg-slate-800 rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
              <Lock className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              2. Automatic Encryption
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Your files are automatically encrypted using AES-256 military-grade encryption. Only you hold the encryption keys.
            </p>
            <div className="mt-auto pt-4">
              <Image 
                src="/api/placeholder/300/160" 
                alt="Encryption process illustration" 
                width={300} 
                height={160} 
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center bg-gray-50 dark:bg-slate-800 rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
              <Share className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              3. Access Anywhere or Share
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Access your files from any device securely, or share them with others via encrypted time-limited links.
            </p>
            <div className="mt-auto pt-4">
              <Image 
                src="/api/placeholder/300/160" 
                alt="Sharing process illustration" 
                width={300} 
                height={160} 
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-gray-50 dark:bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Advanced Security Features
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Our platform employs multiple layers of protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 mb-4">
                <Key className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">End-to-End Encryption</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Files are encrypted before leaving your device and remain encrypted during transit and storage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 mb-4">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Automatic Backups</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data is automatically backed up across multiple secure locations to prevent any loss.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Access Controls</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set granular permissions on who can view, edit, or share your files with detailed access logs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 mb-4">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Zero-Knowledge Storage</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We have no access to your encryption keys, meaning we cannot view your data under any circumstances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="FAQ">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Get answers to common questions about our service
          </p>
        </div>

        <div className="space-y-8" >
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              What happens if I forget my password?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Since we use zero-knowledge encryption, we cannot reset your password. However, you can set up a recovery key during account creation that will help you regain access. We strongly recommend storing this recovery key in a safe place.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              How much storage do I get with my account?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Free accounts come with 5GB of encrypted storage. Our Premium plan offers 500GB, while our Business plan includes 2TB per user with additional storage options available.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Can I share files with people who don't have an account?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No, you can not share data with people who are not on our platform. This has been done to ensure the highest level of security for our users. We authenticate and verify every user on our platform to ensure only authorised users can access your data. On our platform you are the one with the most control over the data and can grant and revoke access with one click. 
            </p>
          </div>

          {/* <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Is my data compliant with regulations like GDPR and HIPAA?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes, our service is designed to be compliant with major regulations including GDPR, HIPAA, CCPA, and more. Business and Enterprise plans include additional compliance features and signed BAAs where required.
            </p>
          </div> */}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to secure your data?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of users who trust Secure Vault with their sensitive information
            </p>
            <div className="mt-8 flex justify-center">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-sm"
              >
                Start Free Trial
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}