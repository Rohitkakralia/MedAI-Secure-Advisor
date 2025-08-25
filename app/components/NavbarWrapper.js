// app/components/NavbarWrapper.jsx
'use client'
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import LoginNavbar from "./LoginNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const isLoginPage = pathname === "/login";
  
  if (isLoginPage) {
    return <LoginNavbar />;
  }
  
  return <Navbar />;
}