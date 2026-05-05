from rest_framework import serializers
from .models import Book, Chapter, Verse

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'number']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'name', 'testament', 'order']

class BookDetailSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'name', 'testament', 'order', 'chapters']

class VerseSerializer(serializers.ModelSerializer):
    book_name = serializers.ReadOnlyField(source='book.name')
    chapter_number = serializers.ReadOnlyField(source='chapter.number')

    class Meta:
        model = Verse
        fields = ['id', 'book_name', 'chapter_number', 'number', 'text']
