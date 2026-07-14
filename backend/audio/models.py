from django.db import models
from bible.models import Verse

class VoiceRecord(models.Model):
    verse = models.ForeignKey(Verse, on_delete=models.CASCADE, related_name='voice_records', verbose_name="구절")
    audio_file = models.FileField(upload_to='voice_records/', verbose_name="녹음 파일")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="생성일시")

    class Meta:
        ordering = ['verse__book__order', 'verse__chapter__number', 'verse__number']
        verbose_name = "음성 녹음"
        verbose_name_plural = "음성 녹음 목록"

    def __str__(self):
        return f"{self.verse} 녹음 - {self.id}"
