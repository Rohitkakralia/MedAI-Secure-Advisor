import Image from "next/image";
import Link from "next/link";

import {
  Shield,
  Database,
  Share2,
  FileKey,
  Lock,
  FileText,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto pt-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="text-center max-w-lg mx-auto">
            <span className="bg-blue-500 bg-opacity-20 text-blue-300 px-4 py-1 rounded-full text-sm font-medium mb-6 inline-block">
              Encrypted & Secured
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Healthcare Documents Secured with{" "}
              <span className="text-[#4C8BF5]">SecureVault</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Military-grade encryption for your sensitive healthcare documents
              with decentralized storage and blockchain verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#4C8BF5] hover:bg-[#3A73CC] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                <Lock size={20} />
                <Link href="/login">Secure Your Documents</Link>
              </button>
              <Link href="/how-it-work">
                <button className="bg-transparent border border-[#4C8BF5] hover:bg-[#4C8BF5] hover:bg-opacity-10 text-white font-semibold py-3 px-6 rounded-lg">
                  Learn How It Works
                </button>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block w-full lg:w-[500px] h-[300px] lg:h-[400px] mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-20 blur-xl"></div>
            <div className="relative h-full w-full rounded-lg border border-gray-700 bg-slate-800 p-4 flex items-center justify-center">
              <Image
                src="/HomePage.png"
                alt="SecureVault Home Page"
                width={500}
                height={400}
                className="rounded-lg shadow-xl relative z-10"
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-green-500 bg-opacity-20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                  
                  Encrypted & Secured
                </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Advanced Security Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our comprehensive security system ensures your healthcare documents
            remain private, accessible, and tamper-proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full w-fit mb-4">
              <Shield size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              End-to-End Encryption
            </h3>
            <p className="text-gray-400">
              Military-grade encryption protects your documents from
              unauthorized access, ensuring patient data remains confidential.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="bg-purple-500 bg-opacity-20 p-3 rounded-full w-fit mb-4">
              <Database size={24} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              IPFS Decentralized Storage
            </h3>
            <p className="text-gray-400">
              Documents are stored across a distributed network, eliminating
              single points of failure and ensuring high availability.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="bg-green-500 bg-opacity-20 p-3 rounded-full w-fit mb-4">
              <FileKey size={24} className="text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Blockchain Verification
            </h3>
            <p className="text-gray-400">
              Document hash keys are stored on the blockchain, providing
              immutable proof of document authenticity and integrity.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-full w-fit mb-4">
              <Share2 size={24} className="text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Secure Document Sharing
            </h3>
            <p className="text-gray-400">
              Share documents with specific healthcare providers without
              compromising security, with complete access control.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="bg-red-500 bg-opacity-20 p-3 rounded-full w-fit mb-4">
              <Lock size={24} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">One-Click Decryption</h3>
            <p className="text-gray-400">
              Authorized users can instantly decrypt and access documents with
              proper authentication credentials.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 relative overflow-hidden">
            <div className="bg-indigo-500 bg-opacity-20 p-3 rounded-full w-fit mb-4">
              <FileText size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Healthcare Specialized
            </h3>
            <p className="text-gray-400">
              Built specifically for healthcare document workflows with HIPAA
              compliance and medical record integration.
            </p>
            <div className="absolute top-0 right-0 bg-indigo-500 text-xs px-2 py-1 font-medium">
              New
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto py-16 px-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to secure your healthcare documents?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of healthcare providers who trust SecureVault for
              their document security needs.
            </p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg">
              <Link href="/login">Get Started For Free</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
