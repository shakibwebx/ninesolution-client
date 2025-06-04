import { NextRequest, NextResponse } from 'next/server';
import { getSubdomain } from '../lib/getSubdomain';

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const subdomain = getSubdomain(hostname);

  if (subdomain && !['www', '.vercel.app', ''].includes(subdomain)) {
    const url = req.nextUrl.clone();
    url.pathname = `/shop/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
