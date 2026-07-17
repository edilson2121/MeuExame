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
  const { isAuthenticated, isAdmin, isTeacher } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requireAdmin && !isAdmin) {
      router.push('/dashboard');
      return;
    }

    if (requireTeacher && !isTeacher) {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, isAdmin, isTeacher, router, requireAuth, requireAdmin, requireTeacher]);

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requireTeacher && !isTeacher) {
    return null;
  }

  return <>{children}</>;
}
