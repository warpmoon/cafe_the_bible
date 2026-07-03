---
name: frontend
description: React and TypeScript frontend guidelines for cafe_the_bible
---

# Frontend: cafe_the_bible

This guide applies to React, TypeScript, styling, and UI work under `frontend/`.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Data Fetching:** Axios (`src/api/client.ts`)
- **State Management:** Zustand (`src/store/readingStore.ts`)
- **Styling:** CSS Modules (`*.module.css`)

## Architecture

- `src/pages/`: route-level screens such as `HomePage`, `ReadingPage`, `SearchPage`, `BookmarkPage`, `TodayPage`, `ChapterPage`, and `VersePage`.
- `src/components/Bible/`: Bible-specific selectors, verse lists, and verse items.
- `src/components/Layout/`: `AppLayout`, `Sidebar`, and `BottomTabBar`.
- `src/components/Common/`: shared controls such as search, loading, and skeleton UI.
- `src/api/`: Axios client and Bible API functions.
- `src/store/readingStore.ts`: persisted Zustand state for font size, bookmarks, and reading history.
- `src/styles/variables.css`: shared design tokens.

## State Management

`readingStore.ts` owns persistent local reading state:

- `fontSize`: body text size (`small` | `medium` | `large`).
- `bookmarks`: bookmarked verse IDs.
- `history`: recent reading history, up to 20 entries.
- `persist`: local storage persistence.

Avoid duplicating server data in Zustand when local component state is enough.

## Commands

Run from `frontend/`:

- `npm run dev`: start the Vite dev server.
- `npm run build`: run TypeScript build checks and create production assets.
- `npm run lint`: run ESLint.
- `npm run preview`: preview the production build.

## Conventions

- Use functional components and hooks.
- Define prop types explicitly with TypeScript.
- Name components and page files in `PascalCase`, for example `VerseItem.tsx`.
- Use `camelCase` for functions, variables, and CSS module class names.
- Style components with `*.module.css`.
- Before adding new color, spacing, typography, or radius values, check `src/styles/variables.css` and reuse existing tokens where practical.
- Keep endpoint-specific API functions in `src/api/` and shared HTTP configuration in `src/api/client.ts`.

## UI Verification

No frontend test framework is currently configured. Before submitting frontend changes, run:

- `npm run lint`
- `npm run build`

For UI changes, manually verify desktop and mobile layouts, especially text wrapping, bottom navigation, and Bible reading flows.

## Post-Work Checklist

Common checks are defined in the root `AGENTS.md`. Frontend-specific checks:

- [ ] CSS Modules file is present for new styled UI components.
- [ ] New styles reuse `src/styles/variables.css` tokens where practical.
- [ ] Props and shared data structures have explicit TypeScript types.
- [ ] Bible reading, search, bookmark, and navigation flows remain intact when touched.
- [ ] `npm run lint` and `npm run build` are run for frontend behavior changes, or skipped with a stated reason.
