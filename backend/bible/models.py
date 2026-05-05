from django.db import models

class Book(models.Model):
    TESTAMENT_CHOICES = [
        ('OT', 'Old Testament'),
        ('NT', 'New Testament'),
    ]
    name = models.CharField(max_length=100, verbose_name="책이름")
    testament = models.CharField(max_length=2, choices=TESTAMENT_CHOICES, verbose_name="구약/신약")
    order = models.IntegerField(verbose_name="순서")

    class Meta:
        ordering = ['order']
        verbose_name = "성경"
        verbose_name_plural = "성경 목록"

    def __str__(self):
        return self.name

class Chapter(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='chapters')
    number = models.IntegerField(verbose_name="장 번호")

    class Meta:
        ordering = ['book__order', 'number']
        verbose_name = "장"
        verbose_name_plural = "장 목록"

    def __str__(self):
        return f"{self.book.name} {self.number}장"

class Verse(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='verses')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='verses')
    number = models.IntegerField(verbose_name="절 번호")
    text = models.TextField(verbose_name="내용")

    class Meta:
        indexes = [
            models.Index(fields=['book', 'chapter', 'number']),
        ]
        ordering = ['book__order', 'chapter__number', 'number']
        verbose_name = "절"
        verbose_name_plural = "절 목록"

    def __str__(self):
        return f"{self.book.name} {self.chapter.number}:{self.number}"
