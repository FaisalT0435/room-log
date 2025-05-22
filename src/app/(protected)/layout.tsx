
// src/app/(protected)/layout.tsx
'use client';

import Background from '@/components/Background';
import Navbar     from '@/components/Navbar';
import Image      from 'next/image';
import '@/app/globals.css';   // pastikan Tailwind & vars sudah ter-import

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* background Vanta Birds di belakang */}
      <Background />

      {/* navbar dan konten protected */}
      <Navbar />
      <main className="pt-16 text-black">{children}</main>
<footer className="flex items-center justify-center space-x-2 py-4 ">
    <Image
      src="/logo/logo.png"
      alt="Logo"
      width={45}
      height={45}
      className="inline-block"
    />
  <span className="text-black">
    © {new Date().getFullYear()} Faisal. All rights reserved.
  </span>
</footer>
    </>
  );
}



