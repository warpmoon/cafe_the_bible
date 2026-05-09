# Documentation Guidelines

## Scope

This guide applies to files under `docs/`. Follow the root `../AGENTS.md` for repository-wide conventions.

## Language and Format

Write documentation in Markdown. Use Korean as the main language and English for code identifiers, commands, endpoint names, and common technical terms.

Keep explanations clear, concise, and current with the code. Prefer short sections, examples, and tables when they make information easier to scan.

## Document Types

Use `docs/` for:

- API specifications: REST endpoints, query parameters, request examples, and response shapes.
- Architecture notes: system design, data flow, and backend/frontend boundaries.
- Setup guides: environment configuration, installation, local execution, and deployment notes.

## API Documentation Style

For endpoint docs, include:

- Method and path, for example `GET /api/search/`.
- Query parameters and allowed values, such as `testament=OT|NT`.
- Example request.
- Example response shape.
- Notes about pagination, filtering, or deterministic behavior.

Keep examples minimal but valid. Update docs in the same change when API behavior changes.

## Maintenance Rules

Do not document planned behavior as current behavior. If a feature is not implemented, mark it clearly as planned or omit it. When code and docs disagree, treat code as the source of truth and update the docs.
