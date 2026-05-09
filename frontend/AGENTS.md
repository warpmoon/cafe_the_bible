# Frontend Guidelines

## Scope

This guide applies to files under `frontend/`. Follow the root `../AGENTS.md` for repository-wide conventions.

## Architecture

The frontend uses React 19, TypeScript, Vite, React Router DOM v7, Axios, Zustand, and CSS Modules.

- `src/pages/`: route-level screens: `HomePage`, `ReadingPage`, `SearchPage`, `BookmarkPage`, `TodayPage`, `ChapterPage`, and `VersePage`.
- `src/components/Bible/`: Bible-specific selectors, verse list, and verse item components.
- `src/components/Layout/`: `AppLayout`, `Sidebar`, and `BottomTabBar`.
- `src/components/Common/`: shared controls such as search, loading, and skeleton UI.
- `src/api/`: Axios client and Bible API functions.
- `src/store/readingStore.ts`: persisted Zustand state for font size, bookmarks, and reading history.
- `src/styles/variables.css`: shared design tokens.

## Commands

Run from `frontend/`:

- `npm run dev`: start the Vite dev server.
- `npm run build`: run TypeScript build checks and create production assets.
- `npm run lint`: run ESLint.
- `npm run preview`: preview the production build.

## Coding Style

Use functional components and hooks. Define prop types explicitly with TypeScript. Name components and page files in `PascalCase`, for example `VerseItem.tsx`; use camelCase for functions, variables, and CSS module class names.

Style components with `*.module.css`. Before adding new color, spacing, typography, or radius values, check `src/styles/variables.css` and reuse existing tokens where practical.

## State and Data Fetching

Use `src/api/client.ts` for HTTP configuration and keep endpoint-specific functions in `src/api/`. Use Zustand for persistent reading state only; avoid duplicating server data in the store when React Query or local component state is enough.

## Testing and Verification

No frontend test framework is currently configured. Before submitting frontend changes, run:

- `npm run lint`
- `npm run build`

For UI changes, manually verify desktop and mobile layouts, especially text wrapping, bottom navigation, and Bible reading flows.
