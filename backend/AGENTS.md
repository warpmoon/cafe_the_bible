# Backend Guidelines

## Scope

This guide applies to files under `backend/`. Follow the root `../AGENTS.md` for repository-wide conventions.

## Architecture

The backend uses Django 5.x, Django REST Framework, and SQLite for local development. The `bible` app owns Bible data and API behavior.

- `config/`: project settings, ASGI/WSGI entrypoints, and root URL routing.
- `bible/models.py`: `Book`, `Chapter`, and `Verse` models.
- `bible/serializers.py`: DRF serializers for API output and validation.
- `bible/views.py`: viewsets and API views for books, chapters, verses, search, and daily verse.
- `bible/urls.py`: app-level API routes.
- `bible/management/commands/import_bible.py`: imports Bible data from `../bible.json`.
- `bible/tests.py`: current test entrypoint.

## Key API Endpoints

- `GET /api/books/`: grouped Old/New Testament book list.
- `GET /api/books/{id}/chapters/`: chapter list for a book.
- `GET /api/verses/?book={id}&chapter={num}`: verses for a chapter.
- `GET /api/search/?q={query}&testament={OT|NT}`: paginated text search.
- `GET /api/random/`: deterministic daily verse.

## Commands

Run from `backend/`:

- `python manage.py runserver`: start local API.
- `python manage.py makemigrations`: create migrations after model edits.
- `python manage.py migrate`: apply migrations.
- `python manage.py import_bible`: load Bible data.
- `python manage.py test`: run backend tests.

## Coding Style

Follow PEP 8. Keep data shape in serializers, query/API behavior in views, and schema rules in models. Prefer DRF serializers for validation and response formatting. Type hints are encouraged when they clarify non-obvious inputs or return values.

## Testing

Add focused tests for model behavior, API responses, pagination, search filters, daily verse determinism, and import behavior. Keep tests deterministic and avoid depending on production secrets.

## Configuration

Settings read environment values from `backend/.env`. Do not hard-code secrets. Local development uses SQLite; deployment may use PostgreSQL.
