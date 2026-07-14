from rest_framework import serializers
from .models import VoiceRecord

class VoiceRecordSerializer(serializers.ModelSerializer):
    book_id = serializers.ReadOnlyField(source='verse.book.id')
    book_name = serializers.ReadOnlyField(source='verse.book.name')
    chapter_number = serializers.ReadOnlyField(source='verse.chapter.number')
    verse_number = serializers.ReadOnlyField(source='verse.number')

    class Meta:
        model = VoiceRecord
        fields = ['id', 'verse', 'book_id', 'book_name', 'chapter_number', 'verse_number', 'audio_file', 'created_at']
