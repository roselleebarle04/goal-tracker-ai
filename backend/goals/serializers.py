from rest_framework import serializers
from .models import Goal, Habit, HabitEntry, VisionBoardImage
from datetime import date

class GoalSerializer(serializers.ModelSerializer):
    habits_count = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'category', 'goal_type', 'status', 
                 'target_date', 'progress', 'habits_count', 'days_remaining', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_habits_count(self, obj):
        return obj.habits.filter(is_active=True).count()
    
    def get_days_remaining(self, obj):
        if obj.target_date:
            today = date.today()
            delta = obj.target_date - today
            return delta.days if delta.days >= 0 else 0
        return None
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class HabitSerializer(serializers.ModelSerializer):
    completion_rate = serializers.SerializerMethodField()
    current_streak = serializers.SerializerMethodField()
    
    class Meta:
        model = Habit
        fields = ['id', 'title', 'description', 'goal', 'frequency', 'is_active', 
                 'completion_rate', 'current_streak', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_completion_rate(self, obj):
        total_entries = obj.entries.count()
        if total_entries == 0:
            return 0
        completed_entries = obj.entries.filter(completed=True).count()
        return round((completed_entries / total_entries) * 100, 1)
    
    def get_current_streak(self, obj):
        recent_entries = obj.entries.order_by('-date')[:30]
        streak = 0
        for entry in recent_entries:
            if entry.completed:
                streak += 1
            else:
                break
        return streak
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class HabitEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitEntry
        fields = ['id', 'habit', 'date', 'completed', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']

class VisionBoardImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisionBoardImage
        fields = ['id', 'title', 'image', 'description', 'goal', 'is_generated', 'created_at']
        read_only_fields = ['id', 'is_generated', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class GoalExportSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    goal_type_display = serializers.CharField(source='get_goal_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    habits = HabitSerializer(many=True, read_only=True)
    
    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'category', 'category_display',
                 'goal_type', 'goal_type_display', 'status', 'status_display',
                 'target_date', 'progress', 'habits', 'created_at', 'updated_at']