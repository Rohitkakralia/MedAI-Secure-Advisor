"use client"
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image';
import Link from "next/link";
import { Menu, X, Shield, Info, HelpCircle, Users, PhoneCall, LayoutDashboard, Share2  } from 'lucide-react'


export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and site name */}
          {!session && (
            <div className="flex items-center">
            <Link href="/" className="flex items-center">
            <Shield className="h-8 w-8 text-blue-500" />

              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Secure Vault</span>
            </Link>
          </div>
          )}
          {session && (
            <div className="flex items-center">
            <Link href={session.user.name} className="flex items-center">
            <Shield className="h-8 w-8 text-blue-500" />

              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Secure Vault</span>
            </Link>
          </div>

          )}
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {session && (
              <Link 
              href={session.user.name}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
                  <LayoutDashboard className="h-4 w-4 mr-1" />
              <span>Dashboard</span>
            </Link>
            )}
            {session && (
              <Link 
              href="/shared"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
                  <Share2 className="h-4 w-4 mr-1" /> 
              <span>Shared To</span>
            </Link>
            )}
            {!session && (
              <Link 
              href="/" 
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Link>
            )}
          <Link 
              href="/about" 
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Info className="h-4 w-4 mr-1" />
              <span>About</span>
            </Link>
            <Link 
              href="/how-it-work" 
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>How to Use</span>
            </Link>
            <Link 
              href="/creators" 
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Users className="h-4 w-4 mr-1" />
              <span>Creators</span>
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <PhoneCall  className="h-4 w-4 mr-1"/>
              <span>Contact Us</span>
            </Link>
            
          </div>

          {/* Sign Up and Login buttons for non-authenticated users */}
          {!session && (
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign Up
              </Link>
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Log In
              </Link>
            </div>
          )}

          {/* Profile dropdown for authenticated users */}
          {session && (
            <div className="hidden md:flex md:items-center md:space-x-4 relative">
              <button 
                id="dropdownAvatarNameButton" 
                onClick={() => setShowDropdown(!showDropdown)} 
                // onBlur={() => {
                //   setTimeout(() => {
                //     setShowDropdown(false)
                //   }, 100);
                // }}
                className="flex items-center rounded-full text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 focus:outline-none"
              >
                <Image
                  className="w-8 h-8 rounded-full"
                  src="/background.jpg"
                  alt="user photo"
                  width={32}
                  height={32}
                />
                {/* <span className="ml-2">{session.user.name}</span> */}
              </button>
              {/* <div className="py-2">
                  <Link 
                    href="/login" 
                    onClick={() => signOut()} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </Link>
                </div> */}
              
              {/* Dropdown menu */}
              <div 
                id="dropdownAvatarName" 
                className={`absolute right-0 z-10 ${showDropdown ? "" : "hidden"} mt-2 top-full bg-white divide-y divide-gray-100 rounded-lg shadow w-64 dark:bg-gray-700 dark:divide-gray-600`}
              >
                <Link href="/profile">
                <div className="flex items-center px-4 py-3">
                <Image
                  className="w-8 h-8 rounded-full"
                  src="/background.jpg"
                  alt="user photo"
                  width={34}
                  height={34}
                />
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div className="font-medium">{session.user.name}</div>
                  <div className="truncate">{session.user.email}</div>
                </div>
                </div>
                </Link>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link href="/earnings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Earnings
                    </Link>
                  </li>
                </ul>
                <div className="py-2">
                  <Link 
                    href="/login" 
                    onClick={() => signOut()} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
          {session && (
            <Link 
              href={session.user.name}
              className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4 mr-1" />
              <span>Dashboard</span>
            </Link>
          )}
          {session && (
            <Link 
              href="/shared"
              className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Share2 className="h-4 w-4 mr-1" /> 
              <span>Shared To</span>
            </Link>
          )}
          {!session && (
            <Link 
            href="/" 
            className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4 mr-1" />
            <span>Home</span>
          </Link>
          )}
          
          <Link 
            href="/about" 
            className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <Info className="h-4 w-4 mr-1" />
            <span>About Us</span>
          </Link>
          <Link 
            href="/how-it-work" 
            className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            <span>How to use</span>
          </Link>
          <Link 
            href="/creators" 
            className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <Users className="h-4 w-4 mr-1" />
            <span>Creater</span>
          </Link>
          <Link 
            href="/contact" 
            className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <PhoneCall className="h-4 w-4 mr-1" />
            <span>Contact</span>
          </Link>
          
          
          {!session && (
            <>
              <Link 
                href="/signup" 
                className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Sign Up</span>
              </Link>
              <Link 
                href="/login" 
                className="flex items-center justify-center py-2 px-3 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Log In</span>
              </Link>
            </>
          )}
          
          {session && (
            <Link 
              href="/login" 
              onClick={() => { 
                signOut();
                setIsMenuOpen(false);
              }} 
              className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              <span>Sign out</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}