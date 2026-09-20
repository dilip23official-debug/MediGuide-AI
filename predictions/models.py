from django.db import models
from django.contrib.auth.models import User


class Prediction(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="predictions"
    )

    prediction_type = models.CharField(max_length=100)

    result = models.CharField(max_length=255)

    probability = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.prediction_type} - {self.result}"