# 담당: 최수인 — 취약과목 대시보드 집계
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import QuizAttempt, QuizQuestion
from app.db.session import get_db

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


class SubjectSummary(BaseModel):
    subject: str
    total: int
    correct: int
    accuracy: float


class DashboardSummary(BaseModel):
    subjects: list[SubjectSummary]


@router.get("/summary", response_model=DashboardSummary)
def summary(user_id: str, db: Session = Depends(get_db)) -> DashboardSummary:
    rows = (
        db.query(QuizAttempt, QuizQuestion.subject)
        .join(QuizQuestion, QuizAttempt.question_id == QuizQuestion.id)
        .filter(QuizAttempt.user_id == user_id)
        .all()
    )

    stats: dict[str, dict[str, int]] = {}
    for attempt, subject in rows:
        bucket = stats.setdefault(subject, {"total": 0, "correct": 0})
        bucket["total"] += 1
        if attempt.is_correct:
            bucket["correct"] += 1

    subjects = [
        SubjectSummary(
            subject=subject,
            total=data["total"],
            correct=data["correct"],
            accuracy=round(data["correct"] / data["total"] * 100, 1),
        )
        for subject, data in sorted(stats.items())
    ]
    return DashboardSummary(subjects=subjects)
