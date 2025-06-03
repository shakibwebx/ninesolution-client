'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include', // very important
        });

        if (!res.ok) throw new Error('Unauthenticated');

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        toast.error('Please login first');
        setTimeout(() => router.push('/login'), 1000); // delay redirect so toast is visible
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600 font-medium">Verifying user...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
    <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>

    <div className="flex gap-4">
      <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Dashboard
      </Link>

      <Link href="/login" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Login
      </Link>

      <Link href="/signup" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
        Signup
      </Link>
    </div>
  </div>
  );
};

export default DashboardPage;
