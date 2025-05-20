// src/app/(protected)/layout.tsx
'use client';

import React, { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import '../globals.css';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Navbar at top */}
      <Navbar />

      {/* Main content area; white background and repeated watermark */}
      <main className="flex-grow p-6 protected-bg text-black">
        {children}
      </main>

      {/* Footer: always at bottom */}
      <footer className="bg-white text-center text-black py-4">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </>
  );
}
