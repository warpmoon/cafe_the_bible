# Backend Context (DRF)

# Technical Standards
- Framework: Django 5.x + Django REST Framework
- Database: SQLite (local)
- API Style: RESTful API

# App Structure
- `bible/`: Core app for bible data management.
    - `models.py`: 
        - `Book`: 성경 각 권 (이름, 구약/신약 구분, 순서)
        - `Chapter`: 각 장 (Book 외래키, 장 번호)
        - `Verse`: 각 절 (Book, Chapter 외래키, 절 번호, 본문 텍스트)
    - `views.py`: 
        - `BookViewSet`: 책 목록 (OT/NT 그룹화) 및 상세 조회
        - `ChapterListView`: 특정 책의 장 목록 조회
        - `VerseViewSet`: 필터링된 절 목록 조회
        - `VerseSearchView`: 본문 검색 (Pagination 지원)
        - `DailyVerseView`: 오늘의 말씀 (결정론적 랜덤)
    - `management/commands/import_bible.py`: JSON 파일(`bible.json`)로부터 데이터를 파싱하여 DB에 저장

# API Reference
- `GET /api/books/`: 구약/신약 분류된 전체 목록
- `GET /api/books/{id}/chapters/`: 특정 성경의 장 리스트
- `GET /api/verses/?book={id}&chapter={num}`: 특정 장의 모든 절
- `GET /api/search/?q={query}&testament={OT|NT}`: 성경 검색
- `GET /api/random/`: 오늘의 구절

# Key Commands
```bash
# 디렉토리 이동
cd backend

# 서버 실행
python manage.py runserver

# 마이그레이션
python manage.py makemigrations
python manage.py migrate

# 성경 데이터 임포트
python manage.py import_bible
```

# Coding Conventions
- PEP 8 준수
- Type hinting 권장
- DRF Serializers를 통한 데이터 검증 및 변환
