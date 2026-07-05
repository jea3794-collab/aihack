# LogiMentor

AI 기반 물류관리사 합격 전략 엔진 — AI 바이브 코딩 해커톤 프로젝트

자세한 기획은 [PRD](./PRD_물류관리사_학습도우미.md), 개발 규칙은 [CLAUDE.md](./CLAUDE.md), 팀 역할 분담은 [docs/ROLES.md](./docs/ROLES.md) 참고.

## 팀 구성 (5인)

| 이름 | 파트 | 담당 |
|---|---|---|
| 장민준 | Frontend | Q&A(AI 튜터) 화면, Home |
| 정윤비 | Frontend | 문제풀이/오답노트 UI, 대시보드 |
| 최수인 | Backend | FastAPI 골격, PostgreSQL 스키마, 데이터 적재 |
| 최성윤 | Backend | 검색(키워드/벡터/하이브리드), Redis 캐시 |
| 정재우 | Backend | ReAct Agent, 근거 검증(Reflection) 프롬프트 |

두 파트(`frontend/`, `backend/`)는 REST API로만 연결되므로 각자 디렉터리에서 독립적으로 작업 가능합니다.

## 프로젝트 구조

```
.
├── frontend/          # Next.js + TypeScript + Tailwind + shadcn/ui
├── backend/           # FastAPI + Python
├── docker-compose.yml # PostgreSQL(pgvector) + Redis + backend + frontend
└── docs/
    └── ROLES.md       # 역할/브랜치 전략 상세
```

## 로컬 개발 (Docker first)

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend (Swagger): http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

개별 파트만 로컬에서 돌리고 싶다면 각 디렉터리의 README를 참고하세요.

## 브랜치 전략

- `main`: 항상 데모 가능한 상태 유지
- `feat/frontend-xxx`, `feat/backend-xxx` 형식으로 기능 브랜치 생성 후 PR
