import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Terms of Service | HealthSecure</title>
        <meta name="description" content="HealthSecure's Terms of Service - Learn about the terms governing the use of our platform" />
      </Head>
      
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          
          <div className="text-sm text-gray-500 mb-6">
            Last updated: April 1, 2025
          </div>
          
          <div className="flex mb-6">
            <Link href="/privacyPolicy" className="text-blue-600 hover:text-blue-800 flex items-center">
              <span>View our Privacy Policy</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Agreement to Terms</h2>
              <p className="text-gray-700 mb-3">
                These Terms of Service constitute a legally binding agreement made between you and HealthSecure, concerning your access to and use of our website and services.
              </p>
              <p className="text-gray-700">
                By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Healthcare Provider Responsibilities</h2>
              <p className="text-gray-700 mb-3">
                As a healthcare provider using our services, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
                <li>You are solely responsible for obtaining proper patient consent before uploading any patient data</li>
                <li>You will comply with all applicable privacy laws and regulations, including HIPAA (if applicable)</li>
                <li>You will maintain the confidentiality of any patient information accessed through our services</li>
                <li>You will not share your account credentials with unauthorized users</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Intellectual Property</h2>
              <p className="text-gray-700 mb-3">
                The Service and its original content, features, and functionality are and will remain the exclusive property of HealthSecure and its licensors.
              </p>
              <p className="text-gray-700">
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of HealthSecure.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">User Accounts</h2>
              <p className="text-gray-700 mb-3">
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p className="text-gray-700 mb-3">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
              </p>
              <p className="text-gray-700">
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Acceptable Use</h2>
              <p className="text-gray-700 mb-3">
                You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To exploit, harm, or attempt to exploit or harm minors in any way</li>
                <li>To transmit any material that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, or invasive of another's privacy</li>
                <li>To impersonate or attempt to impersonate HealthSecure, a HealthSecure employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
              <p className="text-gray-700 mb-3">
                In no event shall HealthSecure, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-3 space-y-1">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any unauthorized access, use or alteration of your transmissions or content</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Disclaimer</h2>
              <p className="text-gray-700 mb-3">
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.
              </p>
              <p className="text-gray-700">
                HealthSecure and its licensors do not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Termination</h2>
              <p className="text-gray-700 mb-3">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-700">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed and construed in accordance with the laws of the United States of America, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
              <p className="text-gray-700 mb-3">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us at:
                <br />
                Email: legal@healthsecure.com
                <br />
                Phone: +1 (555) 123-4567
                <br />
                Address: 123 Medical Plaza, Healthcare City, HC 12345
              </p>
            </section>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you have any questions about our Terms of Service, please contact our legal team.
            </p>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default TermsOfServicePage;