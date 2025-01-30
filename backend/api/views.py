from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import RegisterSerializer, JobListingSerializer
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

# USER / AUTH
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": f"Hello, {request.user.username}!"})

class Register(APIView):
    def post(self, request):
        # Validate username
        # - At least 3 characters long
        # - Can contain letters, numbers, and underscores
        # - Must be unique

        # Validate email
        # - Must be a valid email format
        # - Must be unique

        # Validate password
        # - At least 8 characters long
        # - At least one uppercase letter
        # - At least one lowercase letter
        # - At least one number
        # - At least one special character

        # Hash password

        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User successfully registered"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Login(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # Attempt to find user by email first
        user = User.objects.filter(email=email).first()

        # Then try to find user by username
        if not user:
            user = User.objects.filter(username=email).first()

        # `user` will be None if no user was found
        # Additionally check for password
        if user and user.check_password(password):
            # Return JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            return Response({"access": str(refresh.access_token)}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
        
# JOB LISTINGS
class GetJobListings(APIView):
    # Ensure user is authenticated
    permission_classes = [IsAuthenticated]

    def get(self, request):
        job_listings = JobListing.objects.filter(user=request.user)
        serializer = JobListingSerializer(job_listings, many=True)
        return Response(serializer.data)

class CreateJobListing(APIView):
    # Ensure user is authenticated
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = JobListingSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateJobListing(APIView):
    # Ensure user is authenticated
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        job_listing = JobListing.objects.get(pk=pk)
        serializer = JobListingSerializer(job_listing, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

