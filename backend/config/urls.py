from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from medical_reports.views import MedicalReportViewSet
from chatbot.views import ChatSessionViewSet, ChatMessageViewSet
from predictions.views import PredictionViewSet


router = DefaultRouter()

router.register(
    r"reports",
    MedicalReportViewSet,
    basename="reports"
)

router.register(
    r"chat-sessions",
    ChatSessionViewSet,
    basename="chat-sessions"
)

router.register(
    r"chat-messages",
    ChatMessageViewSet,
    basename="chat-messages"
)

router.register(
    r"predictions",
    PredictionViewSet,
    basename="predictions"
)


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/", include(router.urls)),

    path(
        "api/auth/",
        include("accounts.urls")
    ),
]