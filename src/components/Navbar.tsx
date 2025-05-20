'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/logout', { credentials: 'include' });
    router.push('/login');
  }

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Spacer kiri */}
        <div className="w-1/4" />

        {/* Menu tengah */}
        <ul className="w-2/4 flex justify-center space-x-8 text-center">
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

        {/* Logo + Logout di kanan */}
        <div className="w-1/4 flex justify-end items-center space-x-2">
          <Image
            src="/logo/image.png"
            alt="Logo"
            width={32}
            height={32}
          />
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
