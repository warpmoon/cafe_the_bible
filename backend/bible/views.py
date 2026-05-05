from datetime import date
import random
from rest_framework import viewsets, generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Book, Chapter, Verse
from .serializers import BookSerializer, BookDetailSerializer, ChapterSerializer, VerseSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class BookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Book.objects.all().order_by('order')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BookDetailSerializer
        return BookSerializer

    def list(self, request, *args, **options):
        queryset = self.get_queryset()
        ot_books = BookSerializer(queryset.filter(testament='OT'), many=True).data
        nt_books = BookSerializer(queryset.filter(testament='NT'), many=True).data
        return Response({
            'OT': ot_books,
            'NT': nt_books
        })

class ChapterListView(generics.ListAPIView):
    serializer_class = ChapterSerializer

    def get_queryset(self):
        book_id = self.kwargs['book_id']
        return Chapter.objects.filter(book_id=book_id).order_by('number')

class VerseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Verse.objects.all()
    serializer_class = VerseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        book_id = self.request.query_params.get('book')
        chapter_num = self.request.query_params.get('chapter')
        
        if book_id and chapter_num:
            return queryset.filter(book_id=book_id, chapter__number=chapter_num).order_by('number')
        return queryset

class VerseSearchView(generics.ListAPIView):
    serializer_class = VerseSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        testament = self.request.query_params.get('testament')
        
        if len(query) < 2:
            return Verse.objects.none()
            
        queryset = Verse.objects.filter(text__icontains=query)
        if testament:
            queryset = queryset.filter(book__testament=testament)
            
        return queryset.order_by('book__order', 'chapter__number', 'number')[:100]

class DailyVerseView(APIView):
    def get(self, request):
        # 날짜를 시드로 사용하여 매일 같은 결과를 반환
        today = date.today()
        seed = today.year * 10000 + today.month * 100 + today.day
        
        count = Verse.objects.count()
        if count == 0:
            return Response({"error": "No verses found"}, status=status.HTTP_404_NOT_FOUND)
            
        # 결정론적 랜덤 인덱스 선택
        random.seed(seed)
        random_index = random.randint(0, count - 1)
        
        verse = Verse.objects.all()[random_index]
        serializer = VerseSerializer(verse)
        return Response(serializer.data)
