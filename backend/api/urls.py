from django.urls import path
from .views import *

urlpatterns = [
    # User authentication
    path('login/', Login.as_view(), name='login'),
    path('register/', Register.as_view(), name='register'),
    path("refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("protected/", protected_view, name="protected"),
    path('update-profile/', UpdateUser.as_view(), name='update-profile'),
    path('delete-profile/', DeleteUser.as_view(), name='delete-profile'),
    path('users/', GetAllUsers.as_view(), name='users'),

    # Resumes
    path('resumes/', GetAllResumes.as_view(), name='resumes'),
    path('resumes/<int:pk>/', GetResumeById.as_view(), name='get-resume-by-id'),
    path('create-resume/', CreateResume.as_view(), name='create-resume'),
    path('update-resume/<int:pk>/', UpdateResume.as_view(), name='update-resume'),

    #Experiences
    path('experiences/', GetAllExperiences.as_view(), name='experiences'),
    path('experiences/<int:pk>/', GetExperienceById.as_view(), name='get-experience-by-id'),
    path('create-experience/', CreateExperience.as_view(), name='create-experience'),
    path('update-experience/<int:pk>/', UpdateExperience.as_view(), name='update-experience'),
    path('delete-experience/<int:pk>/', DeleteExperience.as_view(), name='delete-experience'),

    #Applications
    path('applications/', GetAllApplications.as_view(), name='applications'),
    path('applications/<int:pk>/', GetApplicationById.as_view(), name='get-application-by-id'),
    path('create-application/', CreateApplication.as_view(), name='create-application'),
    path('update-application/<int:pk>/', UpdateApplication.as_view(), name='update-application'),
    path('delete-application/<int:pk>/', DeleteApplication.as_view(), name='delete-application'),

    path('ping/', Ping.as_view(), name='ping'),
]
