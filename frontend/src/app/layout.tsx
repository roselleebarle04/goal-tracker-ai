import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Goal Tracker - Achieve Your Dreams',
  description: 'A simple, minimal, and distraction-free goal tracking application to help you manage and achieve your goals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-cozy-cream">
      <body className={`${inter.className} bg-cozy-cream min-h-screen`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#4a5d39',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}