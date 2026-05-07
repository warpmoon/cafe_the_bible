# Frontend Context (React)

# Technical Standards
- Framework: React 19 + TypeScript
- Build Tool: Vite
- Styling: CSS Modules (`*.module.css`)
- State Management: Zustand (`src/store/readingStore.ts`)
- Data Fetching: Axios (`src/api/client.ts`)
- Routing: React Router DOM v7

# State Management (Zustand)
- `fontSize`: 본문 텍스트 크기 제어 ('small' | 'medium' | 'large')
- `bookmarks`: 절 ID 배열 기반 북마크 관리
- `history`: 최근 읽은 성경 구절 기록 (최대 20개)
- `persist`: 로컬 스토리지를 통한 상태 유지

# Directory Structure & Pages
- `src/pages/`:
    - `ReadingPage`: 성경 읽기 및 권/장/절 선택 통합 화면
    - `SearchPage`: 성경 본문 키워드 검색
    - `BookmarkPage`: 북마크된 구절 모아보기
    - `TodayPage`: 오늘의 말씀 표시
    - `VersePage`: 구절 단일 상세 보기
- `src/components/`:
    - `Bible/`: `BookSelector`, `ChapterSelector`, `VerseSelector`, `VerseList`, `VerseItem`
    - `Layout/`: `AppLayout`, `Sidebar`, `BottomTabBar`
    - `Common/`: `SearchBar`, `LoadingSpinner`

# Key Commands
```bash
# 디렉토리 이동
cd frontend

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 체크
npm run lint
```

# Coding Conventions
- Functional Components + Hooks 선호
- Props Type 정의 필수
- CSS Modules를 사용한 스타일링 (CamelCase 클래스명 권장)
- 스타일링 설계 및 수정 시 `src/styles/variables.css`에 정의된 전역 변수를 반드시 참고하고 일관성 있게 사용
