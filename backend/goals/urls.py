from django.urls import path
from . import views

urlpatterns = [
    # Goals
    path('', views.GoalListCreateView.as_view(), name='goal-list-create'),
    path('<int:pk>/', views.GoalDetailView.as_view(), name='goal-detail'),
    
    # Habits
    path('habits/', views.HabitListCreateView.as_view(), name='habit-list-create'),
    path('habits/<int:pk>/', views.HabitDetailView.as_view(), name='habit-detail'),
    
    # Habit Entries
    path('habit-entries/', views.HabitEntryListCreateView.as_view(), name='habit-entry-list-create'),
    path('habit-entries/<int:pk>/', views.HabitEntryDetailView.as_view(), name='habit-entry-detail'),
    path('habit-entries/<int:entry_id>/toggle/', views.toggle_habit_entry, name='toggle-habit-entry'),
    
    # Vision Board
    path('vision-board/', views.VisionBoardImageListCreateView.as_view(), name='vision-board-list-create'),
    path('vision-board/<int:pk>/', views.VisionBoardImageDetailView.as_view(), name='vision-board-detail'),
    
    # Dashboard & Stats
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    path('today-habits/', views.todays_habits, name='todays-habits'),
    
    # Export
    path('export/csv/', views.export_goals_csv, name='export-goals-csv'),
]