'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault(); const res = await fetch('/api/forgot-password', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ username: userId }) });
    const data = await res.json(); setMessage(data.message);
  }

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="mb-6 text-center">
          <Image src="logo//logo.png" alt="Logo" width={100} height={100} />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">Forgot Password</h2>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="text" placeholder="User Id"
            value={userId} onChange={e => setUserId(e.target.value)} required
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2"
          />
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">Send Reset Link</button>
        </form>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        <p className="mt-4 text-center"><Link href="/login" className="text-blue-600 hover:underline">Back to Login</Link></p>
      </div>
    </div>
  );
}
