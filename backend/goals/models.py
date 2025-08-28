from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class Goal(models.Model):
    CATEGORY_CHOICES = [
        ('career', 'Career'),
        ('health', 'Health'),
        ('finance', 'Finance'),
        ('education', 'Education'),
        ('relationships', 'Relationships'),
        ('personal', 'Personal Development'),
        ('travel', 'Travel'),
        ('hobbies', 'Hobbies'),
        ('other', 'Other'),
    ]
    
    GOAL_TYPE_CHOICES = [
        ('short_term', 'Short-term (< 6 months)'),
        ('long_term', 'Long-term (6+ months)'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPE_CHOICES, default='short_term')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    target_date = models.DateField()
    progress = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.email}"

class Habit(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='habits', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='daily')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.email}"

class HabitEntry(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='entries')
    date = models.DateField()
    completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['habit', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.habit.title} - {self.date} - {'Completed' if self.completed else 'Not Completed'}"

class VisionBoardImage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vision_board_images')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='vision_images', null=True, blank=True)
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='vision_board/')
    description = models.TextField(blank=True)
    is_generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.email}"