import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value;
  const isAuthenticated = !!token && !!user;
  
  const path = request.nextUrl.pathname;

  // Rotas públicas
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.includes(path);

  if (isAuthenticated && isPublicPath && path !== '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/login', '/register'],
};
