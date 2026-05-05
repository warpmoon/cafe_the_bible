# Frontend Context (React)

# Technical Standards
- Framework: React 19 + TypeScript
- Build Tool: Vite
- Styling: CSS Modules (`*.module.css`)
- State Management: Zustand (readingStore.ts 확인됨)
- Data Fetching: Axios (client.ts 확인됨)

# Directory Structure
- `src/api/`: API client and endpoint definitions.
- `src/components/`: Reusable UI components.
    - `Layout/`: Layout-related components (Sidebar, BottomTabBar).
    - `Bible/`: Bible-specific components (BookSelector, VerseList, etc.).
- `src/hooks/`: Custom React hooks (e.g., `useBible`).
- `src/pages/`: Page-level components.
- `src/store/`: Global state management.
- `src/types/`: TypeScript interface/type definitions.

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
