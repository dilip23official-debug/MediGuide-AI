from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from pypdf import PdfReader

from .models import MedicalReport
from .serializers import MedicalReportSerializer


class MedicalReportViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalReport.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        report = serializer.save(user=self.request.user)

        if report.file.name.lower().endswith(".pdf"):
            try:
                reader = PdfReader(report.file.path)

                text = ""

                for page in reader.pages:
                    text += page.extract_text() or ""

                report.extracted_text = text
                report.save(update_fields=["extracted_text"])

            except Exception:
                report.extracted_text = ""
                report.save(update_fields=["extracted_text"])

    @action(
        detail=True,
        methods=["post"],
        url_path="summarize"
    )
    def summarize(self, request, pk=None):
        report = self.get_object()

        if not report.extracted_text:
            return Response(
                {"detail": "No extracted text available."},
                status=400
            )

        return Response({
            "report_id": report.id,
            "message": "AI summary endpoint is ready.",
            "extracted_text": report.extracted_text,
        })