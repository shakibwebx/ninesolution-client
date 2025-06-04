'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ShopDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState('');
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🧠 1. Extract subdomain as shop name
  useEffect(() => {
    const host = window.location.hostname;
    const name = host.split('.')[0];
    setShopName(name);
  }, []);

  // 📦 2. Load token from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      setToken(stored);
    }
  }, []);

  // 🔐 3. Listen for postMessage auth events (optional for cross-subdomain login/logout)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== 'http://ninesolution-client.vercel.app') return;

      const { auth_token, type } = event.data || {};

      if (auth_token) {
        localStorage.setItem('auth_token', auth_token);
        setToken(auth_token);
      }

      if (type === 'logout') {
        localStorage.removeItem('auth_token');
        setUser(null);
        setToken(null);
        router.push('http://ninesolution-client.vercel.app/login');
      }
    };

    window.addEventListener('message', handler);
    window.opener?.postMessage({ status: 'ready' }, 'http://ninesolution-client.vercel.app');

    return () => window.removeEventListener('message', handler);
  }, [router]);

  // 🧪 4. Verify token
  useEffect(() => {
    if (!token) return;

    const verifyUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Unauthorized');
        }

        setUser(data.user);
      } catch (err: any) {
        console.error('Verification failed:', err.message);
        localStorage.removeItem('auth_token');
        setError(err.message || 'Unauthorized');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token, router]);

  // 🔓 Logout handler
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  // ⏳ While verifying
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-lg font-medium text-gray-700">Verifying authentication...</p>
      </div>
    );
  }

  // ❌ Error
  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg font-semibold">{error || 'Access denied.'}</p>
      </div>
    );
  }

  // ✅ Authenticated
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">
        This is <span className="text-blue-600">{shopName}</span> shop
      </h1>
      <p>Welcome, {user.username}</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md"
      >
        Logout
      </button>
    </div>
  );
}
