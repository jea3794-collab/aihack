# 팀 역할 분담

PRD 7장 기준으로 실제 팀원을 배정했습니다. 프론트엔드/백엔드 두 파트는 REST API 계약(`backend/README.md`의 엔드포인트 목록)만 맞추면 독립적으로 작업할 수 있습니다.

## Frontend (`frontend/`) — 2명

| 담당자 | 범위 | 주요 디렉터리 |
|---|---|---|
| 장민준 | Home, AI 튜터(Q&A) 화면 — 질문 입력, 근거 원문 표시 UI | `src/app/page.tsx`, `src/app/ai-tutor/` |
| 정윤비 | 문제풀이 UI, 오답노트, 취약과목 대시보드 | `src/app/quiz/`, `src/app/wrong-notes/`, `src/app/dashboard/` |

공통: 사이드바 레이아웃 및 디자인 시스템(Glassmorphism, Green+Orange Gradient)은 `src/components/layout/Sidebar.tsx`, `src/app/globals.css`에서 함께 관리.

## Backend (`backend/`) — 3명

| 담당자 | 범위 | 주요 디렉터리 |
|---|---|---|
| 최수인 | FastAPI 골격, PostgreSQL 스키마 설계, 법령/기출문제 데이터 적재, CRUD | `app/db/`, `app/api/routes/quiz.py`, `app/api/routes/wrong_notes.py` |
| 최성윤 | 키워드/벡터/하이브리드 검색, Redis 캐시(Cache-aside + TTL) | `app/services/search/`, `app/services/cache/` |
| 정재우 | ReAct Agent 설계, 근거 검증(Reflection) 프롬프트, `app/api/routes/qa.py` 연동 | `app/services/agent/` |

## 브랜치 컨벤션

- `feat/frontend-<본인이름>-<기능>` 예: `feat/frontend-jangminjun-ai-tutor`
- `feat/backend-<본인이름>-<기능>` 예: `feat/backend-choisuin-schema`
- PR은 최소 1인 리뷰 후 `main`에 머지

## 협업 규칙

- API 스펙 변경 시 `backend/README.md`의 엔드포인트 표를 먼저 업데이트하고 프론트엔드 담당자에게 공유
- 매일 오전/오후 타임라인 체크포인트(PRD 8장)마다 헬스체크(`/health`)로 프론트-백엔드 연결 확인
