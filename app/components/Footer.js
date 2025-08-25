import React from 'react';
import Link from 'next/link';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Menu, X, Shield, Info, HelpCircle, Users } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">SecureVault</h2>
            <p className="text-gray-300 mb-4">
              Secure healthcare data management for medical professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              
              <li>
                <Link href="/about" className="text-gray-300 flex hover:text-white transition-colors">
                <Info className="h-4 w-4 mr-1 mt-1" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-work" className="text-gray-300 flex hover:text-white transition-colors">
                <HelpCircle className="h-4 w-4 mr-1 mt-1" />
                  How to Use
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-gray-300 flex hover:text-white transition-colors">
                <Users className="h-4 w-4 mr-1 mt-1" />
                  Creators
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
             
              <li>
                <Link href="/how-it-work#FAQ" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/how-it-work" className="text-gray-300 hover:text-white transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/privacyPolicy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <Link href="mailto:rohitkakralia94@gmail.com"><li>Email: rohitkakralia94@gmail.com</li></Link>
              <li>Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} SecureVault. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm text-gray-400">
                <li>
                  <Link href="/terms-of-service" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacyPolicy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;