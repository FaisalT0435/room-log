// src/app/layout.tsx
import { link } from 'fs'
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'RoomLog App',
  description: 'Aplikasi pencatatan masuk ruangan',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  )
}
