import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Privacy Policy | HealthSecure</title>
        <meta name="description" content="HealthSecure's Privacy Policy - Learn how we protect your data" />
      </Head>
      
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          
          <div className="text-sm text-gray-500 mb-6">
            Last updated: April 1, 2025
          </div>
          
          <div className="flex mb-6">
            <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-800 flex items-center">
              <span>View our Terms of Service</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Introduction</h2>
              <p className="text-gray-700 mb-3">
                At HealthSecure, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              <p className="text-gray-700">
                Please read this Privacy Policy carefully. By accessing or using our service, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy and our Terms of Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
              <p className="text-gray-700 mb-3">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
                <li>Register for an account</li>
                <li>Upload medical images and related patient information</li>
                <li>Fill out forms</li>
                <li>Contact customer support</li>
                <li>Use our services</li>
              </ul>
              <p className="text-gray-700">
                This information may include your name, email address, professional credentials, and information about patients (including names, ages, medical conditions, and encrypted medical images).
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Data Security</h2>
              <p className="text-gray-700 mb-3">
                We implement a variety of security measures to maintain the safety of your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
                <li>All patient data is encrypted at rest and in transit</li>
                <li>We use industry-standard encryption protocols</li>
                <li>Regular security assessments and audits</li>
                <li>Limited access to personal information by authorized personnel only</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and store medical data securely</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Send you technical notices and updates</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Sharing of Information</h2>
              <p className="text-gray-700 mb-3">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except in the following cases:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
                <li>To comply with legal requirements and processes</li>
                <li>To protect and defend the rights or property of HealthSecure</li>
                <li>With service providers who help us operate our business (subject to confidentiality agreements)</li>
                <li>With your consent or at your direction</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
              <p className="text-gray-700 mb-3">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your information</li>
                <li>Restriction or objection to certain processing activities</li>
                <li>Data portability</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-3">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p className="text-gray-700">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Children's Privacy</h2>
              <p className="text-gray-700">
                Our Service is not directed to anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@healthsecure.com
                <br />
                Phone: +1 (555) 123-4567
                <br />
                Address: 123 Medical Plaza, Healthcare City, HC 12345
              </p>
            </section>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you have any questions about our Privacy Policy, please contact our legal team.
            </p>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default PrivacyPolicyPage;