'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

interface UserInfo {
  username: string;
  shops: string[];
}

const Dashboard = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        setUser({
          username: data.username,
          shops: data.shops || [],
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleShopRedirect = (shop: string) => {
    // Validate shop name
    if (!/^[a-z0-9-]+$/i.test(shop)) {
      toast.error('Invalid shop name');
      return;
    }

    // For development using localhost subdomains
    if (process.env.NODE_ENV === 'development') {
      // First set a cookie on the main domain
      document.cookie = `parentAuth=true; path=/; domain=localhost`;
      
      // Then redirect
      window.location.href = `http://${shop}.localhost:3000`;
    } else {
      // Production redirect
      window.location.href = `https://${shop}.yourdomain.com`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800">🏬 Dashboard</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition duration-300">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 mt-2 shadow-lg rounded-xl p-2">
              <DropdownMenuLabel className="text-muted-foreground text-sm mb-1">
                Signed in as <span className="font-bold text-primary">{user.username}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1">
                <p className="text-sm font-medium mb-2 text-gray-700">🛍️ Your Shops</p>
                <div className="space-y-2">
                  {user.shops.map((shop, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left hover:bg-accent text-gray-800"
                      onClick={() => handleShopRedirect(shop)}
                    >
                      🔗 {shop}
                    </Button>
                  ))}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 font-semibold hover:bg-red-100 cursor-pointer"
              >
                🚪 Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome, {user.username} 👋</h2>
          <p className="text-gray-600">Manage your shops from the menu above.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;