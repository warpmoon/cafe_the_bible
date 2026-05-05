from django.contrib import admin
from .models import Book, Chapter, Verse

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('order', 'name', 'testament')
    list_filter = ('testament',)
    search_fields = ('name',)

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('book', 'number')
    list_filter = ('book',)
    search_fields = ('book__name', 'number')

@admin.register(Verse)
class VerseAdmin(admin.ModelAdmin):
    list_display = ('book', 'chapter_number', 'number', 'text_summary')
    list_filter = ('book', 'chapter__number')
    search_fields = ('text', 'book__name')
    raw_id_fields = ('chapter', 'book')

    def chapter_number(self, obj):
        return obj.chapter.number
    chapter_number.short_description = "장"

    def text_summary(self, obj):
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
    text_summary.short_description = "내용"
