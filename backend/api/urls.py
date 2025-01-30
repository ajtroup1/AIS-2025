from django.urls import path
from .views import *

urlpatterns = [
    # User authentication
    path('login', Login.as_view(), name='login'),
    path('register', Register.as_view(), name='register'),
    path("refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("protected/", protected_view, name="protected"),
]
