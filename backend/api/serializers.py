from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password
from .models import *

# Register User
class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        min_length=3,
        max_length=150,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9_]+$",
                message="Username can only contain letters, numbers, and underscores.",
                code="invalid_username"
            )
        ]
    )
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def validate_password(self, value):
        import re
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# Base Serializer
class BaseSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
    
    def delete(self, instance):
        instance.delete()
        return instance

# Resume
class ResumeSerializer (BaseSerializer):
        class Meta:
            model = Resume
            fields = "__all__"
    
# Experience
class ExperienceSerializer(BaseSerializer):
    class Meta:
        model = Experience
        fields = "__all__"

# ResExp
class ResExpSerializer(BaseSerializer):
    class Meta:
        model = ResExp
        fields = "__all__"

# Application
class ApplicationSerializer(BaseSerializer):
    class Meta:
        model = Application
        fields = "__all__"