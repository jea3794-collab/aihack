# 담당: 최수인 — 오답노트 조회
import json

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import QuizQuestion, WrongNote
from app.db.session import get_db

router = APIRouter(prefix="/api/wrong-notes", tags=["wrong-notes"])


class WrongNoteOut(BaseModel):
    id: int
    questionId: int
    subject: str
    question: str
    choices: list[str]
    submittedIndex: int
    correctIndex: int
    explanation: str | None = None
    createdAt: str


@router.get("", response_model=list[WrongNoteOut])
def list_wrong_notes(user_id: str, db: Session = Depends(get_db)) -> list[WrongNoteOut]:
    rows = (
        db.query(WrongNote, QuizQuestion)
        .join(QuizQuestion, WrongNote.question_id == QuizQuestion.id)
        .filter(WrongNote.user_id == user_id)
        .order_by(WrongNote.created_at.desc())
        .all()
    )
    return [
        WrongNoteOut(
            id=note.id,
            questionId=question.id,
            subject=question.subject,
            question=question.question,
            choices=json.loads(question.choices),
            submittedIndex=note.submitted_index,
            correctIndex=question.answer_index,
            explanation=question.explanation,
            createdAt=note.created_at.isoformat(),
        )
        for note, question in rows
    ]
