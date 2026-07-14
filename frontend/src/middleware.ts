import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value;
  const isAuthenticated = !!token && !!user;
  
  const path = request.nextUrl.pathname;

  // Rotas públicas
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.includes(path);

  // Rotas de admin
  const isAdminPath = path.startsWith('/admin');

  if (isAdminPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verificar se é admin
  if (isAdminPath && user) {
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (isAuthenticated && isPublicPath && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/register'],
};
