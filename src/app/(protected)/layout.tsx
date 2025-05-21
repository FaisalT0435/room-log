
// src/app/(protected)/layout.tsx
'use client';

import Background from '@/components/Background';
import Navbar     from '@/components/Navbar';
import '@/app/globals.css';   // pastikan Tailwind & vars sudah ter-import

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* background Vanta Birds di belakang */}
      <Background />

      {/* navbar dan konten protected */}
      <Navbar />
      <main className="pt-16 text-black">{children}</main>
      <footer className="text-center text-black py-4">
        © {new Date().getFullYear()} PT. XXXXX . All rights reserved.
      </footer>
    </>
  );
}



