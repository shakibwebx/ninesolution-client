'use client';

import { useEffect, useState } from 'react';

const ShopPage = () => {
  const [shopName, setShopName] = useState<string | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname; // e.g. beautyhub.localhost
    const [subdomain] = hostname.split('.');

    // If you're using localhost, subdomain will be `beautyhub` from `beautyhub.localhost`
    if (subdomain && subdomain !== 'localhost') {
      setShopName(subdomain);
    }
  }, []);

  if (!shopName) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">
        This is <span className="text-primary">{shopName}</span> shop
      </h1>
    </div>
  );
};

export default ShopPage;
