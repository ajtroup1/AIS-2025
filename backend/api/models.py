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

# Resume model tracks a resume that is uploaded by the user
class Resume(models.Model):
    file_path = models.FileField(upload_to="resumes/")
    created_at = models.DateTimeField(auto_now_add=True)
    resume_name = models.CharField(max_length=200)
    # content = models.TextField() #do we even need this??
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="resumes")

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
    city = models.CharField(max_length=200) #might be better off to use enum
    state = models.CharField(max_length=200) #might be better off to use enum
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="experiences")

# Associative entity between Resume and Experience
class ResExp (models.Model):
    resume_id = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="res-exp")
    experience_id = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name="res-exp")


# Application is a job application that the user applied to
# Stores the status of the application as well as information about the position
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
    city = models.CharField(max_length=200) #might be better off to use enum
    state = models.CharField(max_length=200) #might be better off to use enum
    submitted_date = models.DateTimeField()
    description = models.TextField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resume_id = models.ForeignKey(Resume, on_delete=models.CASCADE)


# class Meta:
#     unique_together = ("user", "version") 

# def save(self, *args, **kwargs):
#     if not self.pk:
#         latest_resume = Resume.objects.filter(user=self.user).order_by("-version").first()
#         self.version = (latest_resume.version + 1) if latest_resume else 1
#     super().save(*args, **kwargs)
