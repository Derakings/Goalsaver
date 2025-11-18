'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { LoadingPage } from '@/components/ui/Spinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
