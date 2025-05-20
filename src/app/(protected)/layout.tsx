// src/app/(protected)/layout.tsx
import './../globals.css'
import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}
