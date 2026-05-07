# Project Context

- Type: 학습 프로젝트 (React + DRF 학습)
- Goal: 기술 역량 개발, 실험
- Timeline: 유연함, 속도보다 품질 중시

# Current Status (2026-05-07 기준)

## Backend (Implemented)
- **Data Model**: Book, Chapter, Verse 모델 구현 (성경/장/절 구조)
- **Data Import**: JSON 파일을 통한 성경 데이터 대량 임포트 기능 (`import_bible` command)
- **API Endpoints**:
    - `GET /api/books/`: 구약/신약 분류된 책 목록 조회
    - `GET /api/books/{id}/chapters/`: 특정 책의 장 목록 조회
    - `GET /api/verses/`: 필터링된 절 목록 조회 (book, chapter)
    - `GET /api/search/`: 성경 내용 검색 (부분 일치, 테스트먼트 필터)
    - `GET /api/random/`: 오늘의 말씀 (매일 변경되는 결정론적 랜덤)
- **Pagination**: 검색 결과에 대한 페이지네이션 적용

## Frontend (Implemented)
- **Core Pages**:
    - `HomePage`: 구약/신약 목록 및 네비게이션
    - `ChapterPage`: 특정 책의 장 선택
    - `ReadingPage`: 성경 본문 읽기 (장 단위)
    - `SearchPage`: 키워드 기반 성경 검색 (검색 결과 클릭 시 해당 위치로 즉시 이동)
    - `BookmarkPage`: 즐겨찾기 목록 (북마크 클릭 시 해당 위치로 즉시 이동)
    - `TodayPage`: 오늘의 말씀 및 묵상
    - `VersePage`: 특정 구절 상세 보기
- **State Management (Zustand)**:
    - 폰트 크기 설정 (small, medium, large)
    - 북마크 기능 (로컬 스토리지 유지)
    - 최근 읽은 기록 (History) 관리
- **Aesthetics & UX**:
    - 브라우저 탭 이름('Cafe_the_bible') 및 파비콘 적용
    - 성경 구절 이동 시 불필요한 강조 애니메이션 제거 (즉시 포커싱 유지)
- **Components**:
    - `AppLayout`: 사이드바 및 하단 탭바를 포함한 반응형 레이아웃
    - `VerseList`, `BookSelector` 등 도메인 특화 컴포넌트

# Tech Stack

- **Frontend**: React 19 + TypeScript, CSS Modules, React Router DOM v7, Zustand, Axios
- **Backend**: Django REST Framework (DRF), SQLite (개발) / PostgreSQL (배포 예정)

# Directory Layout

```
cafe_the_bible/
├── backend/          # Django 프로젝트 → backend/GEMINI.md 참조
├── frontend/         # React 앱 → frontend/GEMINI.md 참조
└── docs/             # API 명세 및 문서 → docs/GEMINI.md 참조
```

# Quick Start

```bash
# 백엔드 (backend/ 디렉토리에서)
python manage.py runserver          # http://localhost:8000

# 프런트엔드 (frontend/ 디렉토리에서)
npm run dev                         # http://localhost:5176
```

# Sub-GEMINI.md 목록

| 경로                 | 역할                                            |
| -------------------- | ----------------------------------------------- |
| `frontend/GEMINI.md` | 프런트엔드 명령어, 컴포넌트 구조, 스타일링 규칙 |
| `backend/GEMINI.md`  | 백엔드 명령어, 앱 구조, DRF 설정                |
| `docs/GEMINI.md`     | API 명세 작성 규칙, 문서화 컨벤션               |
