'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiTarget, FiTrendingUp, FiCalendar, FiCheck } from 'react-icons/fi';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-sand to-cozy-warm">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 ${isLoaded ? 'animate-fadeIn' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-7xl font-bold text-cozy-moss mb-6">
            Goal Tracker
          </h1>
          <p className="text-xl md:text-2xl text-cozy-brown mb-8 max-w-3xl mx-auto">
            A simple, minimal, and distraction-free way to manage and achieve your dreams
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-cozy-moss hover:bg-cozy-moss/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white/80 hover:bg-white text-cozy-moss px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-cozy-moss/20"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: FiTarget,
              title: 'Set Big Goals',
              description: 'Define meaningful goals with dates and categories to stay focused on what matters most.'
            },
            {
              icon: FiCheck,
              title: 'Daily Habits',
              description: 'Build consistent daily habits that align with your bigger goals and track your progress.'
            },
            {
              icon: FiTrendingUp,
              title: 'Track Progress',
              description: 'Monitor your advancement with visual dashboards and insightful progress summaries.'
            },
            {
              icon: FiCalendar,
              title: 'Vision Board',
              description: 'Visualize your dreams with auto-generated images and create inspiring vision boards.'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isLoaded ? 'animate-fadeIn' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-cozy-sage/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-cozy-moss" />
              </div>
              <h3 className="text-xl font-semibold text-cozy-moss mb-2">
                {feature.title}
              </h3>
              <p className="text-cozy-brown">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className={`bg-white/40 backdrop-blur-sm rounded-3xl p-8 mb-16 ${
          isLoaded ? 'animate-fadeIn' : 'opacity-0'
        }`}>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cozy-moss mb-2">500+</div>
              <div className="text-cozy-brown">Goals Achieved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cozy-moss mb-2">1000+</div>
              <div className="text-cozy-brown">Habits Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cozy-moss mb-2">95%</div>
              <div className="text-cozy-brown">Success Rate</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center ${isLoaded ? 'animate-fadeIn' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-cozy-moss mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-lg text-cozy-brown mb-8 max-w-2xl mx-auto">
            Join thousands of people who are already achieving their goals with our simple, effective tracking system.
          </p>
          <Link
            href="/register"
            className="bg-cozy-moss hover:bg-cozy-moss/90 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}