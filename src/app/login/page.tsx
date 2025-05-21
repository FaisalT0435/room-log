'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [userId, setUserId] = useState('admin');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userId, password })
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Coba lagi.');
    }
  }

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="mb-6 text-center">
          <Image
            src="/logo/image.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">Welcome Room Monitor</h2>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            placeholder="User Id"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            required
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 text-black"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 pr-10 text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Login
          </button>
          <button
            type="button"
            onClick={submit}
            className="w-full bg-red-400 hover:bg-red-500 text-white py-2 rounded"
          >
            Auto Login
          </button>
        </form>
        <p className="mt-4 text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}
