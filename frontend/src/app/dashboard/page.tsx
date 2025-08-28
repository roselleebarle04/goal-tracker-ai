'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Layout/Navigation';
import { dashboardAPI, habitsAPI, goalsAPI, type DashboardStats, type Goal } from '@/lib/api';
import { FiTarget, FiCheck, FiTrendingUp, FiCalendar, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaysHabits, setTodaysHabits] = useState<any[]>([]);
  const [recentGoals, setRecentGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        const [statsData, habitsData, goalsData] = await Promise.all([
          dashboardAPI.getStats(),
          habitsAPI.getTodaysHabits(),
          goalsAPI.getGoals({ limit: 5 })
        ]);
        
        setStats(statsData);
        setTodaysHabits(habitsData);
        setRecentGoals(goalsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const toggleHabit = async (entryId: number) => {
    try {
      const updatedEntry = await habitsAPI.toggleHabitEntry(entryId);
      setTodaysHabits(prev => 
        prev.map(item => 
          item.entry.id === entryId ? { ...item, entry: updatedEntry } : item
        )
      );
      
      // Refresh stats
      const updatedStats = await dashboardAPI.getStats();
      setStats(updatedStats);
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-sand to-cozy-warm">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cozy-moss"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-sand to-cozy-warm flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cozy-moss mb-4">Please sign in to continue</h1>
          <Link href="/login" className="bg-cozy-moss text-white px-6 py-3 rounded-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-sand to-cozy-warm">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cozy-moss mb-2">
            Welcome back, {user.first_name || user.email}!
          </h1>
          <p className="text-cozy-brown">Here&apos;s your progress overview for today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                <FiTarget className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-cozy-moss">{stats?.active_goals || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-cozy-brown mb-1">Active Goals</h3>
            <p className="text-xs text-cozy-brown/70">
              {stats?.completed_goals || 0} completed
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-cozy-moss">{stats?.completion_rate || 0}%</span>
            </div>
            <h3 className="text-sm font-medium text-cozy-brown mb-1">Today&apos;s Progress</h3>
            <p className="text-xs text-cozy-brown/70">
              {stats?.today_habits_completed || 0} of {stats?.total_today_habits || 0} habits
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-cozy-moss">{stats?.weekly_completion || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-cozy-brown mb-1">This Week</h3>
            <p className="text-xs text-cozy-brown/70">Habits completed</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-cozy-moss">{stats?.overdue_goals || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-cozy-brown mb-1">Overdue Goals</h3>
            <p className="text-xs text-cozy-brown/70">Need attention</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Habits */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-cozy-moss">Today&apos;s Habits</h2>
              <Link
                href="/habits"
                className="text-sm text-cozy-brown hover:text-cozy-moss transition-colors"
              >
                View all
              </Link>
            </div>
            
            {todaysHabits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-cozy-brown mb-4">No habits for today</p>
                <Link
                  href="/habits"
                  className="inline-flex items-center space-x-2 bg-cozy-moss text-white px-4 py-2 rounded-lg hover:bg-cozy-moss/90 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Habit</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysHabits.map((item) => (
                  <div
                    key={item.entry.id}
                    className="flex items-center space-x-3 p-3 bg-white/40 rounded-lg"
                  >
                    <button
                      onClick={() => toggleHabit(item.entry.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.entry.completed
                          ? 'bg-cozy-moss border-cozy-moss'
                          : 'border-cozy-brown/30 hover:border-cozy-moss'
                      }`}
                    >
                      {item.entry.completed && <FiCheck className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        item.entry.completed ? 'line-through text-cozy-brown/60' : 'text-cozy-moss'
                      }`}>
                        {item.habit.title}
                      </h3>
                      {item.habit.description && (
                        <p className="text-xs text-cozy-brown/70">{item.habit.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Goals */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-cozy-moss">Recent Goals</h2>
              <Link
                href="/goals"
                className="text-sm text-cozy-brown hover:text-cozy-moss transition-colors"
              >
                View all
              </Link>
            </div>
            
            {recentGoals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-cozy-brown mb-4">No goals yet</p>
                <Link
                  href="/goals"
                  className="inline-flex items-center space-x-2 bg-cozy-moss text-white px-4 py-2 rounded-lg hover:bg-cozy-moss/90 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Create Goal</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentGoals.map((goal) => (
                  <div key={goal.id} className="p-3 bg-white/40 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-cozy-moss">{goal.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        goal.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : goal.status === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-cozy-brown/70">
                      <span>{goal.category}</span>
                      <span>{goal.days_remaining} days left</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-cozy-brown/20 rounded-full h-2">
                        <div
                          className="bg-cozy-moss h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;