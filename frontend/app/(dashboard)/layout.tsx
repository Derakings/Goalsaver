'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { WelcomeMessage } from '@/components/shared/WelcomeMessage';
import { OnboardingTutorial } from '@/components/shared/OnboardingTutorial';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, showWelcome, setShowWelcome, isNewUser } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if user hasn't completed the tutorial
    if (user && !user.hasCompletedTutorial && isNewUser) {
      // Show tutorial after a short delay (after welcome message)
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [user, isNewUser]);

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar onShowTutorial={handleShowTutorial} />
        {showWelcome && user && (
          <WelcomeMessage
            firstName={user.firstName}
            isNewUser={isNewUser}
            onClose={() => setShowWelcome(false)}
          />
        )}
        {showTutorial && (
          <OnboardingTutorial onComplete={() => setShowTutorial(false)} />
        )}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
