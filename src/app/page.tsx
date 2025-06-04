'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-6">This is Home Page</h1>
      <nav className="flex gap-4">
        <Link href="/login" passHref>
          <Button asChild>
            <a>Login</a>
          </Button>
        </Link>

        <Link href="/signup" passHref>
          <Button variant="outline" asChild>
            <a>Signup</a>
          </Button>
        </Link>

        <Link href="/dashboard" passHref>
          <Button variant="secondary" asChild>
            <a>Dashboard</a>
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;
