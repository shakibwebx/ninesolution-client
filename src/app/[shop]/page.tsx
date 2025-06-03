'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ShopDashboard = ({ shopName }: { shopName: string }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) throw new Error('Unauthenticated');

                setAuthenticated(true);
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader">Loading...</div> {/* Replace with your spinner */}
            </div>
        );
    }

    if (!authenticated) {
        return null; // This will be rare as router redirects
    }

    return (
        <div>
            <h1>This is {shopName} shop</h1>
            {/* Your shop dashboard content here */}
        </div>
    );
};

export default ShopDashboard;
