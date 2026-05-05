# Backend Context (DRF)

# Technical Standards
- Framework: Django 5.x + Django REST Framework
- Database: SQLite (local)
- API Style: RESTful API

# App Structure
- `bible/`: Core app for bible data management.
    - `models.py`: Bible books, chapters, and verses.
    - `views.py`: API endpoints for retrieving bible data.
    - `management/commands/import_bible.py`: Command to load bible data from JSON.

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
