import json
import re
from django.core.management.base import BaseCommand
from bible.models import Book, Chapter, Verse

class Command(BaseCommand):
    help = 'Import bible data from bible.json'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, help='Path to bible.json')

    def handle(self, *args, **options):
        file_path = options['file']
        if not file_path:
            self.stdout.write(self.style.ERROR('Please provide a file path using --file'))
            return

        # 성경 66권 매핑 정보
        BIBLE_BOOKS_INFO = [
            ("창", "창세기", "OT", 1), ("출", "출애굽기", "OT", 2), ("레", "레위기", "OT", 3), ("민", "민수기", "OT", 4), ("신", "신명기", "OT", 5),
            ("수", "여호수아", "OT", 6), ("삿", "사사기", "OT", 7), ("룻", "룻기", "OT", 8), ("삼상", "사무엘상", "OT", 9), ("삼하", "사무엘하", "OT", 10),
            ("왕상", "열왕기상", "OT", 11), ("왕하", "열왕기하", "OT", 12), ("대상", "역대상", "OT", 13), ("대하", "역대하", "OT", 14), ("스", "에스라", "OT", 15),
            ("느", "느헤미야", "OT", 16), ("에", "에스더", "OT", 17), ("욥", "욥기", "OT", 18), ("시", "시편", "OT", 19), ("잠", "잠언", "OT", 20),
            ("전", "전도서", "OT", 21), ("아", "아가", "OT", 22), ("사", "이사야", "OT", 23), ("렘", "예레미야", "OT", 24), ("애", "예레미야애가", "OT", 25),
            ("겔", "에스겔", "OT", 26), ("단", "다니엘", "OT", 27), ("호", "호세아", "OT", 28), ("욜", "요엘", "OT", 29), ("암", "아모스", "OT", 30),
            ("옵", "오바댜", "OT", 31), ("욘", "요나", "OT", 32), ("미", "미가", "OT", 33), ("나", "나훔", "OT", 34), ("합", "하박국", "OT", 35),
            ("습", "스바냐", "OT", 36), ("학", "학개", "OT", 37), ("슥", "스카랴", "OT", 38), ("말", "말라기", "OT", 39),
            ("마", "마태복음", "NT", 40), ("막", "마가복음", "NT", 41), ("눅", "누가복음", "NT", 42), ("요", "요한복음", "NT", 43), ("행", "사도행전", "NT", 44),
            ("롬", "로마서", "NT", 45), ("고전", "고린도전서", "NT", 46), ("고후", "고린도후서", "NT", 47), ("갈", "갈라디아서", "NT", 48), ("엡", "에베소서", "NT", 49),
            ("빌", "빌립보서", "NT", 50), ("골", "골로새서", "NT", 51), ("살전", "데살로니가전서", "NT", 52), ("살후", "데살로니가후서", "NT", 53), ("딤전", "디모데전서", "NT", 54),
            ("딤후", "디모데후서", "NT", 55), ("딛", "디도서", "NT", 56), ("몬", "빌레몬서", "NT", 57), ("히", "히브리서", "NT", 58), ("약", "야고보서", "NT", 59),
            ("벧전", "베드로전서", "NT", 60), ("벧후", "베드로후서", "NT", 61), ("요일", "요한일서", "NT", 62), ("요이", "요한이서", "NT", 63), ("요삼", "요한삼서", "NT", 64),
            ("유", "유다서", "NT", 65), ("계", "요한계시록", "NT", 66)
        ]

        self.stdout.write("Initializing Book and Chapter objects...")
        book_cache = {}
        chapter_cache = {}

        for abbr, name, testament, order in BIBLE_BOOKS_INFO:
            book, created = Book.objects.get_or_create(
                order=order,
                defaults={'name': name, 'testament': testament}
            )
            book_cache[abbr] = book

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        total = len(data)
        count = 0
        verses_to_create = []

        self.stdout.write(f"Starting import of {total} verses...")

        for ref, text in data.items():
            # Parse reference (e.g., "창1:1")
            match = re.match(r'([^\d]+)(\d+):(\d+)', ref)
            if not match:
                continue

            abbr, chapter_num, verse_num = match.groups()
            book = book_cache.get(abbr)
            if not book:
                continue

            chapter_key = (book.id, int(chapter_num))
            if chapter_key not in chapter_cache:
                chapter, created = Chapter.objects.get_or_create(
                    book=book,
                    number=int(chapter_num)
                )
                chapter_cache[chapter_key] = chapter
            
            chapter = chapter_cache[chapter_key]

            # Check if verse already exists to skip
            if not Verse.objects.filter(chapter=chapter, number=int(verse_num)).exists():
                verses_to_create.append(Verse(
                    book=book,
                    chapter=chapter,
                    number=int(verse_num),
                    text=text.strip()
                ))

            if len(verses_to_create) >= 1000:
                Verse.objects.bulk_create(verses_to_create)
                count += len(verses_to_create)
                verses_to_create = []
                self.stdout.write(f"Progress: {count}/{total} ({(count/total)*100:.1f}%)")

        if verses_to_create:
            Verse.objects.bulk_create(verses_to_create)
            count += len(verses_to_create)

        self.stdout.write(self.style.SUCCESS(f"Successfully imported {count} verses."))
