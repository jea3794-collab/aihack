# 담당: 최수인 — 기출문제 풀이 CRUD
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


class QuizQuestionOut(BaseModel):
    id: int
    subject: str
    question: str
    choices: list[str]


class SubmitRequest(BaseModel):
    selected_index: int


@router.get("", response_model=list[QuizQuestionOut])
def list_questions(subject: str | None = None) -> list[QuizQuestionOut]:
    # TODO: DB 조회로 교체
    return []


@router.post("/{question_id}/submit")
def submit_answer(question_id: int, request: SubmitRequest) -> dict:
    # TODO: 채점 로직 + 오답 시 WrongNote 저장
    return {"question_id": question_id, "correct": False}
