# Backend (FastAPI)

담당: 최수인(스키마/CRUD), 최성윤(검색/캐시), 정재우(Agent) — 상세는 [../docs/ROLES.md](../docs/ROLES.md)

## 로컬 실행

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

또는 루트에서 `docker compose up backend db redis`.

## 디렉터리 구조

```
app/
├── main.py                # FastAPI 앱 진입점
├── core/config.py         # 환경변수 로딩
├── db/                    # SQLAlchemy 세션, 모델 (담당: 최수인)
├── api/routes/
│   ├── qa.py               # AI Q&A — 담당: 정재우
│   ├── quiz.py             # 기출문제 풀이 — 담당: 최수인
│   ├── wrong_notes.py       # 오답노트 — 담당: 최수인
│   └── dashboard.py         # 취약과목 대시보드 — 담당: 최수인
└── services/
    ├── search/              # 키워드/벡터/하이브리드 검색 — 담당: 최성윤
    ├── cache/               # Redis cache-aside + TTL — 담당: 최성윤
    └── agent/               # ReAct Agent, Reflection — 담당: 정재우
```

## API 엔드포인트 (초안 — 변경 시 이 표를 먼저 갱신)

| Method | Path | 설명 | 담당 |
|---|---|---|---|
| GET | `/health` | 헬스체크 | 최수인 |
| POST | `/api/qa/ask` | 질문 → 근거 기반 답변 | 정재우 |
| GET | `/api/quiz` | 과목별 문제 목록 | 최수인 |
| POST | `/api/quiz/{question_id}/submit` | 답안 제출/채점 | 최수인 |
| GET | `/api/wrong-notes` | 오답노트 목록 | 최수인 |
| GET | `/api/dashboard/summary` | 과목별 정답률 | 최수인 |
