# Project Overview: cafe_the_bible

React와 Django REST Framework 학습을 위한 개인 성경 읽기 애플리케이션입니다.

## Project Goal

- 성경 본문 읽기, 검색, 북마크, 오늘의 말씀 경험 구현.
- 속도보다 품질과 학습 효과를 우선합니다.
- 백엔드는 성경 데이터를 REST API로 제공하고, 프론트엔드는 읽기 중심 UX를 제공합니다.
- 유지보수가 쉬운 계층적 구조와 명확한 문서 라우팅을 지향합니다.

## Core Tech Stack

- **Backend:** Django 5.x + Django REST Framework
- **Database:** SQLite (local) / PostgreSQL (deployment candidate)
- **Frontend:** React 19 + TypeScript + Vite
- **Routing:** React Router DOM v7
- **State:** Zustand
- **HTTP:** Axios
- **Style:** CSS Modules + shared CSS variables

## Read Order

이 파일은 라우터입니다. 작업 범위에 맞는 문서를 추가로 읽으세요.

| 작업 범위 | 읽을 문서 |
| --- | --- |
| 백엔드 수정 (Django/DRF/API) | `.agents/skills/backend/SKILL.md` |
| 프론트엔드 수정 (React/TS/UI) | `.agents/skills/frontend/SKILL.md` |
| 문서 수정 | `.agents/skills/docs/SKILL.md` |
| 작업 계획, 승인, 완료 보고 절차 | `docs/ai/workflow.md` |

## Project Structure

- `backend/`: Django 프로젝트와 `bible` 앱.
- `frontend/`: React + TypeScript + Vite 앱.
- `docs/`: API 명세, 설정, 아키텍처 문서.
- `bible.json`: 백엔드 import workflow의 원천 데이터.
- `.agents/skills/`: 작업 범위별 실제 규칙 문서.

## Global Conventions

### Absolute Rules

- **No Placeholders:** 코드 수정 시 `...`, `기존 코드 생략`, `TODO로 대체` 같은 placeholder를 삽입하지 않습니다.
- **No Partial Imports:** 새로운 클래스, 함수, 타입 사용 시 import 누락과 중복을 확인합니다.
- **Security:** API 키, 비밀번호, `SECRET_KEY`, 배포용 설정값 등 민감 정보를 커밋하지 않습니다.
- **Strict Directory Context:** 패키지 관리 명령은 해당 앱 디렉토리에서 실행합니다. 예를 들어 frontend 의존성 명령은 반드시 `frontend/`에서 실행합니다.
- **Scope Control:** 요청 범위를 벗어난 리팩터링이나 문서 정리는 사용자 승인이 있을 때만 수행합니다.

### Common Checklist

- [ ] 모든 import 누락과 중복 없음
- [ ] Placeholder 주석 또는 생략 코드 없음
- [ ] 민감 정보 노출 없음
- [ ] 작업 범위에 맞는 `.agents/skills/*/SKILL.md` 확인
- [ ] 수정 전 계획 보고와 사용자 승인 절차 준수

## Documentation Sync

각 규칙은 정확히 한 파일에만 존재합니다. 이 파일은 규칙의 위치를 가리키는 라우터 역할을 합니다.

- 백엔드 상세 규칙과 체크리스트: `.agents/skills/backend/SKILL.md`
- 프론트엔드 상세 규칙과 체크리스트: `.agents/skills/frontend/SKILL.md`
- 문서 작성 규칙: `.agents/skills/docs/SKILL.md`
- 작업 절차와 승인 규칙: `docs/ai/workflow.md`

규칙 수정 시, 그 규칙이 실제로 존재하는 단일 파일만 수정합니다. 같은 내용을 `AGENTS.md`, `GEMINI.md`, 하위 문서에 반복해서 복제하지 않습니다.

## Agent Tooling Notes

- 이 프로젝트는 Codex, Gemini CLI, Claude Code 계열 도구를 함께 사용할 수 있습니다.
- `GEMINI.md`와 `CLAUDE.md`는 별도 규칙을 담지 않고, 루트 `AGENTS.md`를 먼저 읽으라는 안내만 포함합니다.
- 하위 디렉토리의 `AGENTS.md`와 `GEMINI.md`도 실제 규칙을 복제하지 않고 관련 skill 문서로 안내합니다.
