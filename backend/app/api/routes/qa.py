# 담당: 정재우 — AI Q&A (ReAct Agent + 근거 검증)
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/qa", tags=["qa"])


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str
    sources: list[str]


@router.post("/ask", response_model=AskResponse)
def ask(request: AskRequest) -> AskResponse:
    # TODO: app.services.agent.react_agent 호출로 교체
    return AskResponse(answer="TODO: agent 연동 예정", sources=[])
