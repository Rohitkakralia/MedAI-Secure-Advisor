"use client"
import Image from 'next/image';
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield, Info, HelpCircle, Users, PhoneCall, LayoutDashboard, Share2 } from 'lucide-react'

export default function LoginNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and site name */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Shield className="h-8 w-8 text-blue-500" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Secure Vault</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <Link 
                            href="/" 
                            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            <Info className="h-4 w-4 mr-1" />
                            <span>Home</span>
                        </Link>
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
                            <PhoneCall className="h-4 w-4 mr-1"/>
                            <span>Contact Us</span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            aria-expanded={isMenuOpen}
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
                    <Link 
                        href="/" 
                        className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Info className="h-4 w-4 mr-1" />
                        <span>Home</span>
                    </Link>
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
                        <span>How to Use</span>
                    </Link>
                    <Link 
                        href="/creators" 
                        className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Users className="h-4 w-4 mr-1" />
                        <span>Creators</span>
                    </Link>
                    <Link 
                        href="/contact" 
                        className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <PhoneCall className="h-4 w-4 mr-1" />
                        <span>Contact</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}