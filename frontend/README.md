# Frontend (Next.js)

담당: 장민준(Home/AI 튜터), 정윤비(문제풀이/오답노트/대시보드) — 상세는 [../docs/ROLES.md](../docs/ROLES.md)

## 로컬 실행

```bash
cd frontend
npm install
npm run dev
```

또는 루트에서 `docker compose up frontend backend`.

백엔드 API 주소는 `.env.local`의 `NEXT_PUBLIC_API_BASE_URL`로 설정 (`.env.example` 참고).

## 디렉터리 구조

```
src/
├── app/
│   ├── page.tsx            # Home — 담당: 장민준
│   ├── ai-tutor/page.tsx    # AI Q&A — 담당: 장민준
│   ├── quiz/page.tsx        # 문제풀이 — 담당: 정윤비
│   ├── wrong-notes/page.tsx # 오답노트 — 담당: 정윤비
│   └── dashboard/page.tsx   # 취약과목 대시보드 — 담당: 정윤비
├── components/
│   ├── layout/Sidebar.tsx  # 공통 사이드바 레이아웃
│   └── ui/                 # shadcn/ui 컴포넌트 (npx shadcn add 로 추가)
└── lib/
    ├── api.ts               # 백엔드 API 클라이언트
    └── utils.ts             # cn() 등 유틸
```

## shadcn/ui 초기화

레포에는 설정 파일(`components.json`)만 준비되어 있습니다. 최초 1회 아래 명령으로 필요한 컴포넌트를 추가하세요.

```bash
npx shadcn@latest add button card input badge
```
