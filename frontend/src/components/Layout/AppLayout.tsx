'use client';

import React from 'react';
import Navigation from './Navigation';
import { AuthProvider } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-sand to-cozy-warm">
        <Navigation />
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
};

export default AppLayout;