from django.db import models
from django.contrib.auth.models import User

# Enum classes:
# job_type field:
class JobType(models.TextChoices):
    INTERNSHIP = "Internship", "Internship"
    CO_OP= "Co-op", "Co-op"
    FULL_TIME = "Full-time", "Full-time"
    PROGRAM = "Program", "Program"
    PART_TIME = "Part-time", "Part-time"

# status field:
class Status(models.TextChoices):
    APPLICATION_SENT = "Application Sent", "Application Sent"
    REJECTED = "Rejected", "Rejected"
    RESPONSE = "Response", "Response"
    INTERVIEW = "Interview", "Interview"
    OFFER = "Offer", "Offer"

# Resume model:
class Resume(models.Model):
    file_path = models.FileField(upload_to="resumes/")
    created_at = models.DateTimeField(auto_now_add=True)
    resume_name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="resumes")

# Experience model:
class Experience(models.Model):
    job_title = models.CharField(max_length=200)
    company = models.CharField(max_length = 200)
    job_type = models.CharField(
        max_length=100,
        choices = JobType.choices,
        default=JobType.INTERNSHIP
    )
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()
    location = models.CharField(max_length=200)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="experiences")

# Associative entity between Resume and Experience
class ResExp (models.Model):
    resume_id = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="res_exp")
    experience_id = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name="res_exp")


# Application model
class Application(models.Model):
    job_title = models.CharField(max_length=200)
    company = models.CharField(max_length = 200)
    # Enum: Application Sent, Rejected, Response, Interview, Offer
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLICATION_SENT
    )
    # Enum: Internship, Co-op, Full-time, Program, Part-time
    job_type = models.CharField(
        max_length=100,
        choices = JobType.choices,
        default=JobType.INTERNSHIP
    )
    location = models.CharField(max_length=200)
    submitted_date = models.DateTimeField()
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    resume_id = models.ForeignKey(Resume, on_delete=models.CASCADE, null=True, blank=True)

