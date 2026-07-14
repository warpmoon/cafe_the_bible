from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import VoiceRecord
from .serializers import VoiceRecordSerializer

class VoiceRecordViewSet(viewsets.ModelViewSet):
    queryset = VoiceRecord.objects.all()
    serializer_class = VoiceRecordSerializer

    def create(self, request, *args, **kwargs):
        verse_id = request.data.get('verse')
        audio_file = request.data.get('audio_file')

        if not verse_id or not audio_file:
            return Response(
                {"error": "verse와 audio_file은 필수 입력값입니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 기존 녹음이 있다면 디스크 및 DB에서 삭제 (덮어쓰기 교체 처리)
        existing_records = VoiceRecord.objects.filter(verse_id=verse_id)
        for record in existing_records:
            if record.audio_file:
                record.audio_file.delete(save=False)
            record.delete()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        queryset = super().get_queryset()
        book_id = self.request.query_params.get('book')
        chapter_num = self.request.query_params.get('chapter')
        verse_id = self.request.query_params.get('verse')

        if verse_id:
            queryset = queryset.filter(verse_id=verse_id)
        elif book_id and chapter_num:
            queryset = queryset.filter(
                verse__book_id=book_id,
                verse__chapter__number=chapter_num
            )
        elif book_id:
            queryset = queryset.filter(verse__book_id=book_id)

        return queryset.order_by('verse__chapter__number', 'verse__number')
