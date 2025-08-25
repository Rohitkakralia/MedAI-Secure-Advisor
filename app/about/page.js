"use client"
import { Shield, Users, Award, Briefcase, Zap, Globe, CheckCircle, ThumbsUp, Clock } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState } from "react";

export default function AboutUs() {

   const [selectedImage, setSelectedImage] = useState(null);
    
    const teamMembers = [
      {
        "name": "Saksham Sharma",
        "title": "Team Lead & Co-Founder",
        "image": "/background.jpg",
        "bio": "Saksham is passionate about technology and innovation, leading the team with a vision to create impactful solutions.",
        "background": "Third-year Computer Science student with experience in web development and software engineering.",
        "social": {
          "github": "https://github.com/saksham",
          "linkedin": "https://linkedin.com/in/saksham",
          "instagram": "https://instagram.com/saksham"
        }
      },
      {
        "name": "Rohit Kakralia",
        "title": "Technical Lead & Co-Founder",
        "image": "/background.jpg",
        "bio": "Rohit specializes in backend development and security, contributing to multiple open-source projects.",
        "background": "Computer Science student with expertise in problem solving and full-stack development.",
        "social": {
          "github": "https://github.com/rohit",
          "linkedin": "https://linkedin.com/in/rohit",
          "instagram": "https://instagram.com/rohit"
        }
      },
      {
        "name": "Sahilpreet Singh",
        "title": "Operations Head & Co-Founder",
        "image": "/background.jpg",
        "bio": "Sahilpreet ensures smooth project execution, focusing on teamwork and efficiency.",
        "background": "Engineering student with experience in programming, managing tech projects and startups.",
        "social": {
          "github": "https://github.com/sahilpreet",
          "linkedin": "https://linkedin.com/in/sahilpreet",
          "instagram": "https://instagram.com/sahilpreet"
        }
      }
    ];
    
    const openImageModal = (member) => {
      setSelectedImage(member);
    };
    
    const closeImageModal = () => {
      setSelectedImage(null);
    };
    

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero Section - More modern with angled divider */}
      <div className="relative bg-gradient-to-br from-blue-700 to-blue-600 dark:from-blue-900 dark:to-blue-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              About Secure Vault
            </h1>
            <div className="h-1 w-24 bg-blue-300 mx-auto mb-6"></div>
            <p className="text-xl text-blue-100">
              Our mission is to provide uncompromising security and privacy for all your sensitive data.
            </p>
          </div>
        </div>

        {/* Diagonal divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}></div>
      </div>

      {/* Quick Stats Banner */}
      {/* <div className="bg-gray-50 dark:bg-slate-800 py-8 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1M+</p>
              <p className="text-gray-600 dark:text-gray-300">Users Protected</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">5,000+</p>
              <p className="text-gray-600 dark:text-gray-300">Businesses</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">150+</p>
              <p className="text-gray-600 dark:text-gray-300">Countries</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">99.99%</p>
              <p className="text-gray-600 dark:text-gray-300">Uptime</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Our Story Section - Card-based layout */}
      <div className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-lg z-0"></div>
              <Image 
                src="/shield.avif" 
                alt="Secure Vault team" 
                width={500} 
                height={400} 
                className="rounded-lg shadow-xl relative z-10"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-50 dark:bg-blue-900/50 rounded-lg z-0"></div>
            </div>
          </div>
          
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="flex items-center mb-6">
              <div className="h-1 w-12 bg-blue-500 mr-4"></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Our Story
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
SecureVault was developed in 2025 by a team of three Computer Science and Engineering students — Rohit Kakralia, Sahilpreet Singh, and Saksham Sharma — as part of their Minor Project for the 6th semester curriculum. Recognizing the increasing importance of data security in healthcare, the team set out to create a blockchain-based file encryption system specifically designed for the healthcare domain.
</p>
<p>
During our project research and development, we identified that traditional healthcare data storage solutions often lacked either robust security or practical usability. Many existing systems were vulnerable due to weak encryption methods, complex user interfaces, or centralized data storage models, all of which exposed sensitive patient information to potential threats. Motivated to solve these challenges, we envisioned a system that could offer uncompromised security without sacrificing ease of use.
</p>
<p>
We built SecureVault on the principle that healthcare data deserves the highest standard of protection. By leveraging blockchain technology and advanced encryption techniques, our system ensures decentralized, tamper-proof storage where only authorized healthcare professionals can access patient files. Our intuitive platform bridges the gap between cutting-edge security and user-friendly design, empowering healthcare providers to safeguard patient trust while focusing fully on delivering quality care.
</p>
 </div>
            
            <div className="mt-8 flex items-center text-blue-600 dark:text-blue-400">
              <Clock className="w-5 h-5 mr-2" />
              <span>Protecting data since 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section - New addition */}
      {/* <div className="bg-gray-50 dark:bg-slate-800 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Our Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The path to becoming a leader in data security
            </p>
          </div>
          
          <div className="relative"> */}
            {/* Vertical line */}
            {/* <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 dark:bg-blue-700"></div> */}
            
            {/* Timeline items */}
            {/* <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">2019</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Founded by Emily Chen and Marcus Johnson with seed funding</p>
                </div>
                <div className="bg-blue-500 rounded-full w-6 h-6 z-10 flex-shrink-0"></div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 dark:text-gray-300">Initial beta release with zero-knowledge architecture</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0 order-1 md:order-1">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 dark:text-gray-300">Secured Series A funding and expanded team to 30 people</p>
                  </div>
                </div>
                <div className="bg-blue-500 rounded-full w-6 h-6 z-10 flex-shrink-0 order-2 md:order-2"></div>
                <div className="md:w-1/2 md:pl-12 order-3 md:order-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">2020</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Enterprise version launched</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">2022</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Reached 500,000 users</p>
                </div>
                <div className="bg-blue-500 rounded-full w-6 h-6 z-10 flex-shrink-0"></div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 dark:text-gray-300">SOC 2 Type II & ISO 27001 Certification</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0 order-1 md:order-1">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 dark:text-gray-300">Surpassed 1 million users and expanded to 150+ countries</p>
                  </div>
                </div>
                <div className="bg-blue-500 rounded-full w-6 h-6 z-10 flex-shrink-0 order-2 md:order-2"></div>
                <div className="md:w-1/2 md:pl-12 order-3 md:order-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Today</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Global security leader</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Our Values - Cards with hover effects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Core Values
          </h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Value 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 hover:border-blue-200 dark:hover:border-blue-800">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full inline-flex mb-4">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Security First</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We never compromise on security. Every decision we make is filtered through the lens of keeping your data protected from all threats.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 hover:border-blue-200 dark:hover:border-blue-800">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full inline-flex mb-4">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">User Privacy</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We believe privacy is a fundamental right. We design our systems so we cannot access your data even if we wanted to.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 hover:border-blue-200 dark:hover:border-blue-800">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full inline-flex mb-4">
              <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Simplicity</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Security should be accessible to everyone. We work tirelessly to make complex security simple and intuitive for all users.
            </p>
          </div>

          {/* Value 4 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 hover:border-blue-200 dark:hover:border-blue-800">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full inline-flex mb-4">
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Excellence</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We hold ourselves to the highest standards in every aspect of our business, from code quality to customer support.
            </p>
          </div>
        </div>
      </div>

      {/* Our Team - Improved cards with social links */}
       <div className="bg-gray-50 dark:bg-slate-800 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Leadership
          </h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The experts behind Secure Vault
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group">
              <div 
                className="aspect-w-1 aspect-h-1 relative cursor-pointer" 
                onClick={() => openImageModal(member)}
              >
                <img 
                  src={member.image} 
                  alt={`${member.name}, ${member.title}`} 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white flex justify-between w-full items-end">
                    <p className="font-medium">{member.background}</p>
                    <div className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 mb-2">{member.title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeImageModal}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-xl">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedImage.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400">{selectedImage.title}</p>
                </div>
                {/* Social Media Icons */}
                <div className="flex space-x-3 mr-8">
                  <a 
                    href={selectedImage.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                  </a>
                  <a 
                    href={selectedImage.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                  </a>
                  <a 
                    href={selectedImage.social.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                    </svg>
                  </a>
                </div>
                {/* <button 
                  onClick={closeImageModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button> */}
              </div>
              <div className="p-4">
                <img 
                  src={selectedImage.image} 
                  alt={`${selectedImage.name}, ${selectedImage.title}`} 
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Background</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedImage.background}</p>
                
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bio</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedImage.bio}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 px-6 py-4 flex justify-end">
                <button
                  onClick={closeImageModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

      {/* Achievements - Horizontal layout */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Achievements
          </h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Recognition of our commitment to excellence in security
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-slate-700">
            <div className="p-8 text-center">
              <Award className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                "Best Security Solution"
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tech Innovation Awards 2024
              </p>
            </div>
            
            <div className="p-8 text-center">
              <ThumbsUp className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                99.99% Uptime
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Since Launch
              </p>
            </div>
            
            <div className="p-8 text-center">
              <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Global Protection
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                150+ Countries Served
              </p>
            </div>
            
            <div className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Security Certified
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                SOC 2 Type II & ISO 27001
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* CTA Section - Improved with wave background */}
      <div className="relative mt-12 bg-blue-600 dark:bg-blue-800 overflow-hidden">
        {/* Wave Pattern */}
        <div className="absolute top-0 left-0 right-0 h-8 opacity-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="white"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="bg-white/10 rounded-2xl backdrop-blur-sm p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join Our Team
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Help us build the future of secure data storage
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/careers" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 shadow-sm transition-colors duration-300"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                View Open Positions
              </Link>
              
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}