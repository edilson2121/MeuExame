'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireTeacher?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireTeacher = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isTeacher, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requireAdmin && !isAdmin) {
      // User is logged in but not admin - redirect to admin login
      router.push('/admin/login');
      return;
    }

    if (requireTeacher && !isTeacher) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, isAdmin, isTeacher, loading, router, requireAuth, requireAdmin, requireTeacher]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">A verificar permissões...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a4 4 0 10-8 0v2m-2 0h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">Apenas administradores podem aceder a esta área.</p>
          <a href="/admin/login" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Login Admin
          </a>
        </div>
      </div>
    );
  }

  if (requireTeacher && !isTeacher) {
    return null;
  }

  return <>{children}</>;
}
