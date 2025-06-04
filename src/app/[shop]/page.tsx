'use client';

import React, { useEffect, useState } from 'react';

function LoadingSpinner() {
  return <div>Loading...</div>; // Replace with fancier spinner if needed
}

export default function ShopDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Extract shop name from subdomain
  const shopName = (() => {
    if (typeof window === 'undefined') return '';
    const host = window.location.hostname; // e.g. "beautyhub.localhost"
    return host.split('.')[0];
  })();

  useEffect(() => {
    // Try to get token from localStorage
    const localToken = localStorage.getItem('auth_token');
    if (localToken) {
      setToken(localToken);
    } else {
      // No token - redirect to main login after short delay
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/login';
      }, 1500);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error('Invalid token');

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('auth_token');
        window.location.href = 'http://localhost:3000/login';
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        This is <span className="text-blue-600">{shopName}</span> shop
      </h1>
      {user && <p>Welcome, {user.username}</p>}
    </div>
  );
}
