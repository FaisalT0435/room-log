// File: src/app/components/Navbar.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Derive patlege ti
  let pageTitle = '';
  if (pathname.startsWith('/dashboard')) pageTitle = 'Dashboard';
  else if (pathname.startsWith('/absen')) pageTitle = 'Absen';
  else if (pathname.startsWith('/summary')) pageTitle = 'Summary';

  // Show/hide on user interaction inactivity
  const [visible, setVisible] = useState(true);
  const hideTimeout = useRef<NodeJS.Timeout>();

  // Reset hide timer and show navbar
  const resetTimer = () => {
    setVisible(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  useEffect(() => {
    // Start initial timer
    resetTimer();
    // Listen for interactions
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { credentials: 'include' });
    router.push('/login');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 shadow transition-transform duration-300 ease-in-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Page title bottom-left */}
      <span className="absolute left-4 bottom-1 text-lg font-medium">
        {pageTitle}
      </span>

      {/* Centered menu */}
      <ul className="flex justify-center space-x-8">
        <li>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/absen" className="hover:underline">
            Absen
          </Link>
        </li>
        <li>
          <Link href="/summary" className="hover:underline">
            Summary
          </Link>
        </li>
      </ul>

      {/* Logo + Logout bottom-right */}
      <div className="absolute right-4 bottom-1 flex items-center space-x-2">
        <Image src="/logo/logo.png" alt="Logo" width={32} height={32} />
        <button onClick={handleLogout} className="hover:underline">
          Logout
        </button>
      </div>
    </nav>
  );
}
