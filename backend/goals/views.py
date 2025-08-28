from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from django.db.models import Q, Count, Avg
from datetime import date, timedelta
import csv
from .models import Goal, Habit, HabitEntry, VisionBoardImage
from .serializers import (
    GoalSerializer, HabitSerializer, HabitEntrySerializer,
    VisionBoardImageSerializer, GoalExportSerializer
)

class GoalListCreateView(generics.ListCreateAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'goal_type', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'target_date', 'progress']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

class HabitListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['frequency', 'is_active', 'goal']
    search_fields = ['title', 'description']
    
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

class HabitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

class HabitEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['habit', 'date', 'completed']
    
    def get_queryset(self):
        return HabitEntry.objects.filter(habit__user=self.request.user)

class HabitEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return HabitEntry.objects.filter(habit__user=self.request.user)

class VisionBoardImageListCreateView(generics.ListCreateAPIView):
    serializer_class = VisionBoardImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['goal', 'is_generated']
    
    def get_queryset(self):
        return VisionBoardImage.objects.filter(user=self.request.user)

class VisionBoardImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VisionBoardImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return VisionBoardImage.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    user = request.user
    
    goals = Goal.objects.filter(user=user)
    active_goals = goals.filter(status='active')
    completed_goals = goals.filter(status='completed')
    
    habits = Habit.objects.filter(user=user, is_active=True)
    
    today = date.today()
    week_ago = today - timedelta(days=7)
    
    today_habits = HabitEntry.objects.filter(
        habit__user=user,
        date=today,
        completed=True
    ).count()
    
    total_today_habits = habits.filter(frequency='daily').count()
    
    weekly_completion = HabitEntry.objects.filter(
        habit__user=user,
        date__gte=week_ago,
        completed=True
    ).count()
    
    overdue_goals = active_goals.filter(target_date__lt=today).count()
    
    stats = {
        'total_goals': goals.count(),
        'active_goals': active_goals.count(),
        'completed_goals': completed_goals.count(),
        'total_habits': habits.count(),
        'today_habits_completed': today_habits,
        'total_today_habits': total_today_habits,
        'weekly_completion': weekly_completion,
        'overdue_goals': overdue_goals,
        'completion_rate': round((today_habits / total_today_habits * 100) if total_today_habits > 0 else 0, 1)
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def todays_habits(request):
    user = request.user
    today = date.today()
    
    daily_habits = Habit.objects.filter(user=user, is_active=True, frequency='daily')
    
    habits_with_entries = []
    for habit in daily_habits:
        entry, created = HabitEntry.objects.get_or_create(
            habit=habit,
            date=today,
            defaults={'completed': False}
        )
        habits_with_entries.append({
            'habit': HabitSerializer(habit).data,
            'entry': HabitEntrySerializer(entry).data
        })
    
    return Response(habits_with_entries)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_habit_entry(request, entry_id):
    try:
        entry = HabitEntry.objects.get(id=entry_id, habit__user=request.user)
        entry.completed = not entry.completed
        entry.save()
        return Response(HabitEntrySerializer(entry).data)
    except HabitEntry.DoesNotExist:
        return Response({'error': 'Habit entry not found'}, status=404)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_goals_csv(request):
    user = request.user
    goals = Goal.objects.filter(user=user)
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="goals_export.csv"'
    
    writer = csv.writer(response)
    writer.writerow([
        'Title', 'Description', 'Category', 'Goal Type', 'Status',
        'Target Date', 'Progress (%)', 'Created At', 'Updated At'
    ])
    
    for goal in goals:
        writer.writerow([
            goal.title,
            goal.description,
            goal.get_category_display(),
            goal.get_goal_type_display(),
            goal.get_status_display(),
            goal.target_date,
            goal.progress,
            goal.created_at.strftime('%Y-%m-%d'),
            goal.updated_at.strftime('%Y-%m-%d')
        ])
    
    return response