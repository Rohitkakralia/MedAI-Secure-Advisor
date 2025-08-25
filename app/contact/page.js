"use client"
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, MessageSquare, Send, Clock } from "lucide-react";
import Link from "next/link";

export default function ContactUs() {

  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    loading: false,
    error: null,
    success: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setStatus({ ...status, loading: true });
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      const data = await response.json();
      
      setStatus({
        submitted: true,
        loading: false,
        error: null,
        success: true
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      console.log('Success:', data);
      
    } catch (error) {
      console.error('Error:', error);
      setStatus({
        submitted: true,
        loading: false,
        error: error.message,
        success: false
      });
    }
  };

  useEffect(() => {
    if (status.success) {
      const timer = setTimeout(() => {
        setStatus({ ...status, success: false });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status.success]);

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 pb-48 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
              Get in touch with our team for support, questions, or feedback about Secure Vault.
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

      {/* Contact Information and Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                  <Link href="mailto:rohitkakralia94@gmail.com" className="mt-1 text-gray-600 dark:text-gray-400">rohitkakralia94@gmail.com</Link>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Support: +1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contact Hours</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Monday - Friday: 9:00 AM - 6:00 PM (PT)<br />
                    Saturday - Sunday: Closed<br />
                    Support available 24/7 for emergency issues
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-gray-50 dark:bg-slate-800 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send Us a Message
            </h2>
            
            
            <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
        <p className="text-gray-600 dark:text-gray-400">Fill out the form below and we'll get back to you as soon as possible.</p>
      </div>
      
      {status.success && (
  <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md">
    Your message has been sent successfully. We'll get back to you soon!
  </div>
)}
      
      {status.error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-md">
          Error: {status.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={status.loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              status.loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {status.loading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-slate-800 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Common Support Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Get quick answers to frequently asked support questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                What's the fastest way to get support?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                For urgent matters, please call our support line. For general inquiries, the contact form typically receives a response within 1 business day.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Do you offer technical consultations?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, our team offers technical consultations for Business and Enterprise customers. Please contact our sales team to schedule.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                How do I report a security vulnerability?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please email security@securevault.example with details. We take security issues seriously and have a dedicated team that investigates all reports.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Can I get a personalized demo?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! Please fill out the contact form or call our sales number to schedule a personalized demo of our secure storage solution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Need immediate assistance?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Our support team is available 24/7 for our premium customers
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a 
                href="tel:+15551234567" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-sm"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Support
              </a>
              {/* <Link 
                href="/knowledge-base" 
                className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Knowledge Base
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}