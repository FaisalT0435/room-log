// src/app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Logbook App',
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
