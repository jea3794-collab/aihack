# 담당: 정재우 — AI Q&A: 문서 검색(현재는 keyword_search) → 근거 기반 답변 생성
# 현재는 단일 패스 RAG(P0). ReAct 재검색 루프 + Reflection 자기검증(스트레치, PRD 3.3)은
# 여기에 MAX_STEPS 상한을 두고 이어서 구현할 것 (PRD 6장 무한호출 리스크 참고)
import anthropic

from app.core.config import settings
from app.db.session import SessionLocal
from app.services.search.keyword_search import keyword_search

MAX_STEPS = 3

SYSTEM_PROMPT = (
    "당신은 물류관리사 시험 학습을 돕는 AI 튜터입니다. "
    "반드시 아래 제공된 문서 근거 안에서만 답변하세요. "
    "근거가 부족하거나 문서에 없는 내용이면 정확히 "
    "'확인 불가: 관련 근거를 찾을 수 없습니다.'라고만 답하세요. "
    "답변 마지막에는 참고한 문서의 제목과 근거(조항 등)를 간단히 밝히세요."
)


def _get_client() -> anthropic.Anthropic | None:
    if not settings.anthropic_api_key:
        return None
    return anthropic.Anthropic(api_key=settings.anthropic_api_key)


def answer_question(question: str, subject: str | None = None) -> dict:
    db = SessionLocal()
    try:
        results = keyword_search(db, question, subject=subject, top_k=5)
    finally:
        db.close()

    if not results:
        return {"answer": "확인 불가: 관련 근거 문서를 찾을 수 없습니다.", "sources": []}

    sources = [f"{r['title']} ({r['source'] or r['subject']})" for r in results]

    client = _get_client()
    if client is None:
        return {"answer": "확인 불가: ANTHROPIC_API_KEY가 설정되지 않았습니다.", "sources": sources}

    context = "\n\n".join(
        f"[{i + 1}] 과목: {r['subject']} / 제목: {r['title']} / 근거: {r['source'] or '없음'}\n{r['content']}"
        for i, r in enumerate(results)
    )

    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        thinking={"type": "adaptive"},
        output_config={"effort": "medium"},
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": f"다음 문서를 참고하여 질문에 답하세요.\n\n{context}\n\n질문: {question}",
            }
        ],
    )

    answer = next((block.text for block in response.content if block.type == "text"), "")
    return {"answer": answer, "sources": sources}
