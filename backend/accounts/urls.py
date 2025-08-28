from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('me/', views.user_profile, name='user-me'),
    path('logout/', views.logout_view, name='logout'),
]