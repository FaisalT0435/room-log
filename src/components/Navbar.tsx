'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  let pageTitle = '';
  if (pathname.startsWith('/dashboard')) pageTitle = 'Dashboard';
  else if (pathname.startsWith('/absen')) pageTitle = 'Absen';
  else if (pathname.startsWith('/summary')) pageTitle = 'Summary';

  // State untuk show/hide (misal ingin auto-hide nav)
  // const [visible, setVisible] = useState(true);

  function handleLogout() {
    fetch('/api/logout', { method: 'POST' }).then(() => {
      router.push('/login');
    });
  }

  return (
    <nav className="bg-red-600 px-4 py-3 flex items-center justify-between shadow-md">
      {/* Kiri: Judul & Logo */}
      <div className="flex items-center space-x-3">
        <Image
          src="/logo/logo.png"
          alt="Logo"
          width={36}
          height={36}
          className="rounded-full bg-white p-1"
          priority
        />
        <span className="text-white text-lg font-semibold tracking-wide">{pageTitle}</span>
      </div>
      {/* Tengah: Navigasi */}
      <div className="flex-1 flex justify-center">
        <ul className="flex space-x-8">
          <li>
            <Link
              href="/dashboard"
              className={`text-white font-medium hover:underline ${pathname.startsWith('/dashboard') ? 'underline' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/absen"
              className={`text-white font-medium hover:underline ${pathname.startsWith('/absen') ? 'underline' : ''}`}
            >
              Absen
            </Link>
          </li>
          <li>
            <Link
              href="/summary"
              className={`text-white font-medium hover:underline ${pathname.startsWith('/summary') ? 'underline' : ''}`}
            >
              Summary
            </Link>
          </li>
        </ul>
      </div>
      {/* Kanan: Logout */}
      <button
        onClick={handleLogout}
        className="bg-white text-red-600 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </nav>
  );
}
