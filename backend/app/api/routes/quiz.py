# 담당: 최수인 — 기출문제 풀이 CRUD
import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import QuizAttempt, QuizQuestion, WrongNote
from app.db.session import get_db

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


class QuizQuestionOut(BaseModel):
    id: int
    subject: str
    question: str
    choices: list[str]


class SubmitRequest(BaseModel):
    user_id: str
    selected_index: int


class SubmitResponse(BaseModel):
    questionId: int
    correct: bool
    correctIndex: int
    explanation: str | None = None


@router.get("", response_model=list[QuizQuestionOut])
def list_questions(subject: str | None = None, db: Session = Depends(get_db)) -> list[QuizQuestionOut]:
    query = db.query(QuizQuestion)
    if subject:
        query = query.filter(QuizQuestion.subject == subject)
    questions = query.order_by(QuizQuestion.id).all()
    return [
        QuizQuestionOut(
            id=q.id,
            subject=q.subject,
            question=q.question,
            choices=json.loads(q.choices),
        )
        for q in questions
    ]


@router.post("/{question_id}/submit", response_model=SubmitResponse)
def submit_answer(question_id: int, request: SubmitRequest, db: Session = Depends(get_db)) -> SubmitResponse:
    question = db.query(QuizQuestion).filter(QuizQuestion.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = request.selected_index == question.answer_index

    db.add(
        QuizAttempt(
            question_id=question_id,
            user_id=request.user_id,
            selected_index=request.selected_index,
            is_correct=is_correct,
        )
    )
    if not is_correct:
        db.add(
            WrongNote(
                question_id=question_id,
                user_id=request.user_id,
                submitted_index=request.selected_index,
            )
        )
    db.commit()

    return SubmitResponse(
        questionId=question_id,
        correct=is_correct,
        correctIndex=question.answer_index,
        explanation=question.explanation,
    )
