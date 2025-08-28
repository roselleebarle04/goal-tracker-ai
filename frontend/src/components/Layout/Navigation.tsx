'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiHome, FiTarget, FiCheckSquare, FiImage, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/goals', label: 'Goals', icon: FiTarget },
    { href: '/habits', label: 'Habits', icon: FiCheckSquare },
    { href: '/vision-board', label: 'Vision Board', icon: FiImage },
    { href: '/profile', label: 'Profile', icon: FiUser },
  ];

  if (!user) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-cozy-brown/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cozy-moss rounded-full flex items-center justify-center">
                <FiTarget className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-cozy-moss hidden sm:block">Goal Tracker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-cozy-moss text-white'
                      : 'text-cozy-brown hover:text-cozy-moss hover:bg-cozy-sage/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cozy-sage rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-cozy-moss">
                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-cozy-brown">
                {user.first_name || user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-cozy-brown hover:text-red-600 transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-cozy-brown hover:text-cozy-moss p-2"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-cozy-brown/10">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-cozy-moss text-white'
                        : 'text-cozy-brown hover:text-cozy-moss hover:bg-cozy-sage/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-cozy-brown/10">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-cozy-sage rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-cozy-moss">
                      {user.first_name?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-cozy-brown">
                    {user.first_name || user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 text-cozy-brown hover:text-red-600 transition-colors w-full"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;