from django.db import models
from django.contrib.auth.models import User

# Application is a job application that the user applied to
# Stores the status of the application as well as information about the position
class JobListing(models.Model):
    class Status(models.TextChoices):
        APPLICATION_SENT = "Application Sent", "Application Sent"
        REJECTED = "Rejected", "Rejected"
        RESPONSE = "Response", "Response"
        INTERVIEW = "Interview", "Interview"
        OFFER = "Offer", "Offer"
    position = models.CharField(max_length=200)
    description = models.TextField()
    company = models.CharField(max_length = 200)
    # Enum: Application Sent, Rejected, Response, Interview, Offer
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLICATION_SENT,
    )
    location = models.CharField(max_length=200)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# Resume model tracks a resume that is uploaded by the user
# Resumes are versioned
class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="resumes")
    file = models.FileField(upload_to="resumes/")
    version = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "version") 

    def save(self, *args, **kwargs):
        if not self.pk:
            latest_resume = Resume.objects.filter(user=self.user).order_by("-version").first()
            self.version = (latest_resume.version + 1) if latest_resume else 1
        super().save(*args, **kwargs)

class Experience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="experiences")
    title = models.CharField(max_length=200)