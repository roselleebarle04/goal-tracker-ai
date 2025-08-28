'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Layout/Navigation';
import { goalsAPI, type Goal } from '@/lib/api';
import { FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiCalendar, FiTarget } from 'react-icons/fi';
import GoalModal from '@/components/Goals/GoalModal';
import toast from 'react-hot-toast';

const GoalsPage: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'career', label: 'Career' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'personal', label: 'Personal Development' },
    { value: 'travel', label: 'Travel' },
    { value: 'hobbies', label: 'Hobbies' },
    { value: 'other', label: 'Other' },
  ];

  const goalTypes = [
    { value: '', label: 'All Types' },
    { value: 'short_term', label: 'Short-term' },
    { value: 'long_term', label: 'Long-term' },
  ];

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    fetchGoals();
  }, [filterCategory, filterType, filterStatus, searchTerm]);

  const fetchGoals = async () => {
    try {
      const params: any = {};
      if (filterCategory) params.category = filterCategory;
      if (filterType) params.goal_type = filterType;
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;

      const data = await goalsAPI.getGoals(params);
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setShowModal(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const handleDeleteGoal = async (id: number) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsAPI.deleteGoal(id);
        setGoals(goals.filter(goal => goal.id !== id));
        toast.success('Goal deleted successfully');
      } catch (error) {
        toast.error('Failed to delete goal');
      }
    }
  };

  const handleGoalSaved = (savedGoal: Goal) => {
    if (editingGoal) {
      setGoals(goals.map(goal => goal.id === savedGoal.id ? savedGoal : goal));
    } else {
      setGoals([savedGoal, ...goals]);
    }
    setShowModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      career: 'bg-purple-100 text-purple-700',
      health: 'bg-green-100 text-green-700',
      finance: 'bg-blue-100 text-blue-700',
      education: 'bg-indigo-100 text-indigo-700',
      relationships: 'bg-pink-100 text-pink-700',
      personal: 'bg-yellow-100 text-yellow-700',
      travel: 'bg-teal-100 text-teal-700',
      hobbies: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (!user) {
    return <div>Please sign in to view your goals.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-sand to-cozy-warm">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cozy-moss mb-2">Goals</h1>
            <p className="text-cozy-brown">Manage your goals and track your progress</p>
          </div>
          <button
            onClick={handleCreateGoal}
            className="mt-4 sm:mt-0 bg-cozy-moss hover:bg-cozy-moss/90 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-brown/60" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
            >
              {goalTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cozy-moss"></div>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <FiTarget className="w-16 h-16 text-cozy-brown/40 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-cozy-moss mb-2">No goals found</h3>
            <p className="text-cozy-brown mb-6">Create your first goal to get started on your journey.</p>
            <button
              onClick={handleCreateGoal}
              className="bg-cozy-moss hover:bg-cozy-moss/90 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Your First Goal</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                {/* Goal Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-cozy-moss mb-2 line-clamp-2">{goal.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                        {categories.find(c => c.value === goal.category)?.label || goal.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-2 text-cozy-brown hover:text-cozy-moss transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-cozy-brown hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Goal Description */}
                {goal.description && (
                  <p className="text-sm text-cozy-brown/80 mb-4 line-clamp-3">{goal.description}</p>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-cozy-moss">Progress</span>
                    <span className="text-sm text-cozy-brown">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-cozy-brown/20 rounded-full h-2">
                    <div
                      className="bg-cozy-moss h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Goal Footer */}
                <div className="flex justify-between items-center text-sm text-cozy-brown/70">
                  <div className="flex items-center space-x-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{goal.days_remaining} days left</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiTarget className="w-4 h-4" />
                    <span>{goal.habits_count} habits</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Goal Modal */}
        {showModal && (
          <GoalModal
            goal={editingGoal}
            onClose={() => setShowModal(false)}
            onSave={handleGoalSaved}
          />
        )}
      </div>
    </div>
  );
};

export default GoalsPage;