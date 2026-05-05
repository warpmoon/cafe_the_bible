# Project Context

- Type: 학습 프로젝트 (React + DRF 학습)
- Goal: 기술 역량 개발, 실험
- Timeline: 유연함, 속도보다 품질 중시

# Tech Stack

- **Frontend**: React 19 + TypeScript, CSS Modules, React Router DOM v7, react-leaflet (지도)
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
