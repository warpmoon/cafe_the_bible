from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VoiceRecordViewSet

router = DefaultRouter()
router.register(r'voice-records', VoiceRecordViewSet, basename='voice-record')

urlpatterns = [
    path('', include(router.urls)),
]
