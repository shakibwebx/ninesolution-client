// lib/getSubdomain.ts
export const getSubdomain = (host: string) => {
    const parts = host.split('.');
    if (parts.length < 3) return null; // root domain like localhost:3000
    return parts[0]; // subdomain
  };
  