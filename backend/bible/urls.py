from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ChapterListView, VerseViewSet, VerseSearchView, DailyVerseView

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'verses', VerseViewSet, basename='verse')

urlpatterns = [
    path('', include(router.urls)),
    path('books/<int:book_id>/chapters/', ChapterListView.as_view(), name='book-chapters'),
    path('search/', VerseSearchView.as_view(), name='verse-search'),
    path('random/', DailyVerseView.as_view(), name='daily-verse'),
]
