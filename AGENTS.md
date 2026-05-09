# Repository Guidelines

## Scope

This root guide applies to the whole `cafe_the_bible` repository. For focused work, also read the nearest directory guide:

- `backend/AGENTS.md` for Django REST Framework work.
- `frontend/AGENTS.md` for React, TypeScript, styling, and UI work.
- `docs/AGENTS.md` for documentation updates.

Use the most specific guide first, then fall back to this file for repository-wide conventions.

## Project Overview

This is a personal Bible study app built for learning and experimentation. Quality is preferred over speed. The backend exposes Bible data through REST APIs, and the frontend provides reading, search, bookmark, and daily verse experiences.

## Project Structure

- `backend/`: Django 5.x + DRF API, local SQLite database, Bible import command.
- `frontend/`: React 19 + TypeScript + Vite app, CSS Modules, Zustand, Axios, React Router.
- `docs/`: Markdown documentation for API specs, setup, and architecture notes.
- `bible.json`: source data used by the backend import workflow.
- `GEMINI.md`: project context mirrored into these contributor guides.

## Common Commands

Run backend commands from `backend/`:

- `python manage.py runserver`: start the API server.
- `python manage.py migrate`: apply migrations.
- `python manage.py import_bible`: import data from `bible.json`.
- `python manage.py test`: run Django tests.

Run frontend commands from `frontend/`:

- `npm run dev`: start Vite.
- `npm run build`: type-check and build.
- `npm run lint`: run ESLint.

## Collaboration Rules

Keep changes scoped to the area requested. Do not mix backend, frontend, and docs changes unless the task requires it. Preserve Korean domain language where it already exists, and use English for code identifiers and common technical terms.

Recent commits use concise Korean summaries such as `파비콘&페이지 타이틀 수정`. Keep commit messages short, descriptive, and focused on one change.

## Security

Do not commit secrets. Backend configuration is read from `backend/.env`; keep values such as `SECRET_KEY`, database URLs, and deployment-only settings out of git.
