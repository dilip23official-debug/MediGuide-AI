from rest_framework import serializers
from .models import MedicalReport


class MedicalReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalReport
        fields = [
            "id",
            "title",
            "file",
            "extracted_text",
            "ai_summary",
            "uploaded_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "extracted_text",
            "ai_summary",
            "uploaded_at",
            "updated_at",
        ]