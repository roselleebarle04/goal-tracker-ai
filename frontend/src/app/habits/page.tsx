'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Layout/Navigation';
import { habitsAPI, goalsAPI, type Habit, type Goal } from '@/lib/api';
import { FiPlus, FiCheck, FiClock, FiTarget, FiEdit2, FiTrash2, FiCalendar, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const HabitsPage: React.FC = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    frequency: 'daily',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitsData, goalsData] = await Promise.all([
        habitsAPI.getHabits(),
        goalsAPI.getGoals({ status: 'active' })
      ]);
      setHabits(habitsData);
      setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = () => {
    setEditingHabit(null);
    setFormData({ title: '', description: '', goal: '', frequency: 'daily' });
    setShowModal(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      title: habit.title,
      description: habit.description,
      goal: habit.goal?.toString() || '',
      frequency: habit.frequency,
    });
    setShowModal(true);
  };

  const handleSaveHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const habitData = {
        ...formData,
        goal: formData.goal ? Number(formData.goal) : null,
      };

      let savedHabit: Habit;
      if (editingHabit) {
        savedHabit = await habitsAPI.updateHabit(editingHabit.id, habitData);
        setHabits(habits.map(h => h.id === savedHabit.id ? savedHabit : h));
        toast.success('Habit updated successfully');
      } else {
        savedHabit = await habitsAPI.createHabit(habitData);
        setHabits([savedHabit, ...habits]);
        toast.success('Habit created successfully');
      }
      
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHabit = async (id: number) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      try {
        await habitsAPI.deleteHabit(id);
        setHabits(habits.filter(h => h.id !== id));
        toast.success('Habit deleted successfully');
      } catch (error) {
        toast.error('Failed to delete habit');
      }
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return <FiClock className="w-4 h-4" />;
      case 'weekly': return <FiCalendar className="w-4 h-4" />;
      case 'monthly': return <FiTarget className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-green-100 text-green-700';
      case 'weekly': return 'bg-blue-100 text-blue-700';
      case 'monthly': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user) {
    return <div>Please sign in to view your habits.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cozy-cream via-cozy-sand to-cozy-warm">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cozy-moss mb-2">Habits</h1>
            <p className="text-cozy-brown">Build consistent daily habits to achieve your goals</p>
          </div>
          <button
            onClick={handleCreateHabit}
            className="mt-4 sm:mt-0 bg-cozy-moss hover:bg-cozy-moss/90 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>

        {/* Habits Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cozy-moss"></div>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-12">
            <FiCheck className="w-16 h-16 text-cozy-brown/40 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-cozy-moss mb-2">No habits yet</h3>
            <p className="text-cozy-brown mb-6">Create your first habit to start building consistency.</p>
            <button
              onClick={handleCreateHabit}
              className="bg-cozy-moss hover:bg-cozy-moss/90 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Your First Habit</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <div key={habit.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                {/* Habit Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-cozy-moss mb-2">{habit.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getFrequencyColor(habit.frequency)}`}>
                        {getFrequencyIcon(habit.frequency)}
                        <span>{habit.frequency}</span>
                      </span>
                      {habit.goal && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          Goal linked
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEditHabit(habit)}
                      className="p-2 text-cozy-brown hover:text-cozy-moss transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-2 text-cozy-brown hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Habit Description */}
                {habit.description && (
                  <p className="text-sm text-cozy-brown/80 mb-4">{habit.description}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cozy-moss">{habit.completion_rate}%</div>
                    <div className="text-xs text-cozy-brown/70">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cozy-moss">{habit.current_streak}</div>
                    <div className="text-xs text-cozy-brown/70">Current Streak</div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    habit.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {habit.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {habit.goal && (
                    <span className="text-xs text-cozy-brown/70">
                      Linked to goal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Habit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-cozy-moss">
                  {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-cozy-brown hover:text-cozy-moss transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveHabit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cozy-moss mb-2">
                    Habit Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                    placeholder="Enter habit title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cozy-moss mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50 resize-none"
                    placeholder="Describe your habit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cozy-moss mb-2">
                    Link to Goal (Optional)
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                    className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                  >
                    <option value="">No goal linked</option>
                    {goals.map(goal => (
                      <option key={goal.id} value={goal.id}>{goal.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cozy-moss mb-2">
                    Frequency *
                  </label>
                  <select
                    required
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-cozy-brown hover:text-cozy-moss transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-cozy-moss hover:bg-cozy-moss/90 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    {editingHabit ? 'Update Habit' : 'Create Habit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsPage;