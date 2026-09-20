from django.db import models
from django.contrib.auth.models import User


class MedicalReport(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="medical_reports"
    )

    title = models.CharField(max_length=255)

    file = models.FileField(upload_to="medical_reports/")

    extracted_text = models.TextField(blank=True)

    ai_summary = models.TextField(blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title