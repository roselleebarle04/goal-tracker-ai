'use client';

import React, { useState, useEffect } from 'react';
import { goalsAPI, type Goal } from '@/lib/api';
import { FiX, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface GoalModalProps {
  goal?: Goal | null;
  onClose: () => void;
  onSave: (goal: Goal) => void;
}

const GoalModal: React.FC<GoalModalProps> = ({ goal, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    goal_type: 'short_term',
    status: 'active',
    target_date: '',
    progress: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        goal_type: goal.goal_type,
        status: goal.status,
        target_date: goal.target_date,
        progress: goal.progress,
      });
    }
  }, [goal]);

  const categories = [
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
    { value: 'short_term', label: 'Short-term (< 6 months)' },
    { value: 'long_term', label: 'Long-term (6+ months)' },
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedGoal: Goal;
      if (goal) {
        savedGoal = await goalsAPI.updateGoal(goal.id, formData);
        toast.success('Goal updated successfully');
      } else {
        savedGoal = await goalsAPI.createGoal(formData);
        toast.success('Goal created successfully');
      }
      onSave(savedGoal);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-cozy-moss">
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-cozy-brown hover:text-cozy-moss transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-cozy-moss mb-2">
              Goal Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
              placeholder="Enter your goal title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-cozy-moss mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50 resize-none"
              placeholder="Describe your goal in detail"
            />
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-cozy-moss mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="goal_type" className="block text-sm font-medium text-cozy-moss mb-2">
                Goal Type *
              </label>
              <select
                id="goal_type"
                name="goal_type"
                required
                value={formData.goal_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
              >
                {goalTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Date and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="target_date" className="block text-sm font-medium text-cozy-moss mb-2">
                Target Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cozy-brown/60" />
                <input
                  id="target_date"
                  name="target_date"
                  type="date"
                  required
                  value={formData.target_date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-cozy-moss mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-cozy-brown/20 rounded-lg focus:ring-2 focus:ring-cozy-moss focus:border-cozy-moss transition-colors bg-white/50"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress */}
          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-cozy-moss mb-2">
              Progress: {formData.progress}%
            </label>
            <input
              id="progress"
              name="progress"
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleInputChange}
              className="w-full h-2 bg-cozy-brown/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-cozy-brown/60 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-cozy-brown hover:text-cozy-moss transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-cozy-moss hover:bg-cozy-moss/90 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;