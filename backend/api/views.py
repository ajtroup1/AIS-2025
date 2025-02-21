from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import *
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .resume_builder import generate_resume
import os
from django.conf import settings

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
        print(email, password)

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
                    "userId": user.id,
                },
                status=status.HTTP_200_OK,
            )

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
class UpdateUser(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user  # Get the authenticated user
        found = User.objects.filter(id=user.id).exists()
        if not found:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if "username" not in request.data or "email" not in request.data:
            return Response({"error": "Username and email are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        username = request.data["username"]
        email = request.data["email"]

        User.objects.update(username=username, email=email)
        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
    
class DeleteUser(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"message": "Profile deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class GetAllUsers(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = RegisterSerializer(users, many=True)
        return Response(serializer.data)


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
        
class GenerateResume(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        position = request.data.get("position")
        if not position:
            return Response({"error": "Position is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return Response({"error": "Authorization header is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract the token part from the "Bearer <token>" format
        token = auth_header.split(" ")[1] if len(auth_header.split()) == 2 else None
        if not token:
            return Response({"error": "Invalid authorization header format"}, status=status.HTTP_400_BAD_REQUEST)

        # Assuming generate_resume creates a Document object
        doc = generate_resume(access_token=token, position=position)
        
        # Save the document to a file (or cloud storage)
        doc_path = os.path.join(settings.MEDIA_ROOT, "resumes", f"{request.user.id}_resume.docx")
        
        # Assuming `doc.save` saves the document to the given path (this depends on the library you're using)
        doc.save(doc_path)

        # Return the file URL (could be a local URL or public URL if uploaded to cloud storage)
        file_url = os.path.join(settings.MEDIA_URL, "resumes", f"{request.user.id}_resume.docx")
        
        return Response({"doc_url": file_url}, status=status.HTTP_200_OK)

        
class Ping(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"message": "pong"})
        

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

def create_api_views(model, serializer):
    """Dynamically generates API views for CRUD operations on a given model."""

    class GetAllObjects(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request):
            objects = model.objects.filter(user=request.user)
            serializer_instance = serializer(objects, many=True)
            return Response(serializer_instance.data)

    class GetObjectById(APIView):
        permission_classes = [IsAuthenticated]
        def get(self, request, pk):
            obj = get_object_or_404(model, user=request.user, pk=pk)
            serializer_instance = serializer(obj)
            return Response(serializer_instance.data)

    class CreateObject(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request):
            serializer_instance = serializer(data=request.data, context={"request": request})
            if serializer_instance.is_valid():
                serializer_instance.save()
                return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
            return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)

    class UpdateObject(APIView):
        permission_classes = [IsAuthenticated]

        def put(self, request, pk):
            obj = get_object_or_404(model, pk=pk, user=request.user)
            serializer_instance = serializer(obj, data=request.data, context={"request": request})
            if serializer_instance.is_valid():
                serializer_instance.save()
                return Response(serializer_instance.data)
            return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)
    
    class DeleteObject(APIView):
        permission_classes = [IsAuthenticated]

        def delete(self, request, pk):
            obj = get_object_or_404(model, pk=pk, user=request.user)
            obj.delete()
            return Response({"message": "Object deleted."}, status=status.HTTP_204_NO_CONTENT)

    return GetAllObjects, GetObjectById, CreateObject, UpdateObject, DeleteObject

# Dynamically create API views for each model
ProfileViews = create_api_views(Profile, ProfileSerializer)
ResumeViews = create_api_views(Resume, ResumeSerializer)
ExperienceViews = create_api_views(Experience, ExperienceSerializer)
ApplicationViews = create_api_views(Application, ApplicationSerializer)

# Assigning dynamically generated views to class names
GetAllProfiles, GetProfileById, CreateProfile, UpdateProfile, DeleteProfile = ProfileViews
GetAllResumes, GetResumeById, CreateResume, UpdateResume, DeleteResume = ResumeViews
GetAllExperiences, GetExperienceById, CreateExperience, UpdateExperience, DeleteExperience = ExperienceViews
GetAllApplications, GetApplicationById, CreateApplication, UpdateApplication, DeleteApplication = ApplicationViews
