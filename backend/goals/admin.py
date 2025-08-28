from django.contrib import admin
from .models import Goal, Habit, HabitEntry, VisionBoardImage

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'goal_type', 'status', 'target_date', 'progress', 'created_at']
    list_filter = ['category', 'goal_type', 'status', 'created_at']
    search_fields = ['title', 'user__email']
    ordering = ['-created_at']

@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'goal', 'frequency', 'is_active', 'created_at']
    list_filter = ['frequency', 'is_active', 'created_at']
    search_fields = ['title', 'user__email']
    ordering = ['-created_at']

@admin.register(HabitEntry)
class HabitEntryAdmin(admin.ModelAdmin):
    list_display = ['habit', 'date', 'completed', 'created_at']
    list_filter = ['completed', 'date', 'created_at']
    search_fields = ['habit__title']
    ordering = ['-date']

@admin.register(VisionBoardImage)
class VisionBoardImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'goal', 'is_generated', 'created_at']
    list_filter = ['is_generated', 'created_at']
    search_fields = ['title', 'user__email']
    ordering = ['-created_at']