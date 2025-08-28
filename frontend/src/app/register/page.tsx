'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const success = await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      
      if (success) {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-sand to-cozy-warm flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-cozy-moss">Goal Tracker</h1>
          </Link>
          <p className="text-cozy-brown mt-2">Create your account to get started.</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-cozy-moss mb-2">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-cozy-moss mb-2">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cozy-moss mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-brown/60" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-cozy-moss mb-2">
                Username *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-brown/60" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cozy-moss mb-2">
                  Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-brown/60" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cozy-brown/60 hover:text-cozy-brown"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-cozy-moss mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-brown/60" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cozy-moss hover:bg-cozy-moss/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-cozy-brown">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-cozy-moss hover:text-cozy-moss/80">
                Sign in
              </Link>
            </p>
            <Link href="/" className="inline-block text-sm text-cozy-brown hover:text-cozy-moss">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;