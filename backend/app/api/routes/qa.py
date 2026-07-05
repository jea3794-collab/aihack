# 담당: 정재우 — AI Q&A (문서 검색 기반 근거 답변)
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.agent.react_agent import answer_question

router = APIRouter(prefix="/api/qa", tags=["qa"])


class AskRequest(BaseModel):
    question: str
    subject: str | None = None


class AskResponse(BaseModel):
    answer: str
    sources: list[str]


@router.post("/ask", response_model=AskResponse)
def ask(request: AskRequest) -> AskResponse:
    result = answer_question(request.question, subject=request.subject)
    return AskResponse(**result)
