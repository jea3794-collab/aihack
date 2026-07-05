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
│   ├── documents.py         # 법령/개념 문서 저장·조회 — 담당: 최수인
│   ├── qa.py               # AI Q&A — 담당: 정재우
│   ├── quiz.py             # 기출문제 풀이 — 담당: 최수인
│   ├── wrong_notes.py       # 오답노트 — 담당: 최수인
│   └── dashboard.py         # 취약과목 대시보드 — 담당: 최수인
└── services/
    ├── search/              # 키워드/벡터/하이브리드 검색 — 담당: 최성윤
    ├── cache/               # Redis cache-aside + TTL — 담당: 최성윤
    └── agent/               # ReAct Agent, Reflection — 담당: 정재우
```

## API 엔드포인트 (변경 시 이 표를 먼저 갱신)

| Method | Path | 설명 | 담당 |
|---|---|---|---|
| GET | `/health` | 헬스체크 | 최수인 |
| POST | `/api/documents` | 법령/개념 문서 저장. 요청: `{subject, title, content, source?}` | 최수인 |
| GET | `/api/documents?subject=` | 저장된 문서 목록 조회 | 최수인 |
| POST | `/api/documents/upload` | 문서 업로드 → 텍스트 추출 후 저장. PDF/DOCX/TXT는 문서 1개, ZIP은 내부의 PDF/DOCX/TXT를 모두 추출해 여러 개로 저장. `multipart/form-data`: `file`, `subject`, `title?`(ZIP이면 무시), `source?` / 응답: 저장된 문서 배열 | 최수인 |
| POST | `/api/qa/ask` | 질문 → 저장된 문서 근거 기반 답변(키워드 검색 + Claude). 요청: `{question, subject?}` / 응답: `{answer, sources[]}` | 정재우 |
| GET | `/api/quiz?subject=` | 과목별 문제 목록. 응답: `{id, subject, question, choices}[]` (정답은 노출 안 함) | 최수인 |
| POST | `/api/quiz/{question_id}/submit` | 답안 제출/채점. 요청: `{user_id, selected_index}` / 응답: `{questionId, correct, correctIndex, explanation}` | 최수인 |
| GET | `/api/wrong-notes?user_id=` | 오답노트 목록. 응답: `{id, questionId, subject, question, choices, submittedIndex, correctIndex, explanation, createdAt}[]` | 최수인 |
| GET | `/api/dashboard/summary?user_id=` | 과목별 정답률. 응답: `{subjects: {subject, total, correct, accuracy}[]}` | 최수인 |
| GET | `/api/dashboard/comparison?user_id=` | 내 과목별 정답률 vs 전체 이용자 평균. 응답: `{subjects: {subject, my_total, my_correct, my_accuracy, overall_total, overall_correct, overall_accuracy}[], total_users}` | 최수인 |

DB 스키마: `app/db/models.py` (Document, QuizQuestion, QuizAttempt, WrongNote). 서버 시작 시 `Base.metadata.create_all` + `app/db/seed.py`로 물류관리론·물류관련법규 샘플 문제가 자동 적재됩니다(테이블이 비어있을 때만).
