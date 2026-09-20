from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
import requests

from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatMessageSerializer


class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(
            user=self.request.user
        ).prefetch_related("messages")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.filter(
            session__user=self.request.user
        ).order_by("created_at")

    @action(
        detail=False,
        methods=["post"],
        url_path="send"
    )
    def send_message(self, request):
        session_id = request.data.get("session")
        user_message = request.data.get("content")

        if not session_id:
            return Response(
                {"detail": "Session ID is required."},
                status=400
            )

        if not user_message:
            return Response(
                {"detail": "Message content is required."},
                status=400
            )

        try:
            session = ChatSession.objects.get(
                id=session_id,
                user=request.user
            )
        except ChatSession.DoesNotExist:
            return Response(
                {"detail": "Chat session not found."},
                status=404
            )

        # Save user's message
        ChatMessage.objects.create(
            session=session,
            role="user",
            content=user_message
        )

        # Get previous conversation
        previous_messages = ChatMessage.objects.filter(
            session=session
        ).order_by("created_at")

        conversation = ""

        for message in previous_messages:
            if message.role == "user":
                conversation += f"User: {message.content}\n"
            elif message.role == "assistant":
                conversation += f"MediGuide AI: {message.content}\n"

        prompt = f"""
You are MediGuide AI, an educational medical information assistant.

Your job is to help users understand general health and medical information.

Important rules:
- Give educational information, not a diagnosis.
- Do not prescribe medicines or provide medication dosages.
- Do not claim certainty about a person's medical condition.
- Explain medical concepts in simple language.
- If symptoms could require urgent medical attention, advise the user to seek appropriate professional care.
- Encourage users to consult a qualified healthcare professional for personal medical decisions.

Conversation:

{conversation}

Respond to the user's latest message clearly and naturally.
"""

        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3.2:3b",
                    "prompt": prompt,
                    "stream": False
                },
                timeout=120
            )

            response.raise_for_status()

            data = response.json()
            ai_response = data["response"].strip()

            # Save AI response
            assistant_message = ChatMessage.objects.create(
                session=session,
                role="assistant",
                content=ai_response
            )

            session.save()

            return Response({
                "session_id": session.id,
                "user_message": user_message,
                "ai_response": ai_response,
                "message_id": assistant_message.id
            })

        except requests.RequestException as e:
            return Response(
                {
                    "detail": "MediGuide AI is currently unavailable.",
                    "error": str(e)
                },
                status=503
            )

        except Exception as e:
            return Response(
                {
                    "detail": "Chatbot failed.",
                    "error": str(e)
                },
                status=500
            )
