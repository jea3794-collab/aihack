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


class SubjectComparison(BaseModel):
    subject: str
    my_total: int
    my_correct: int
    my_accuracy: float
    overall_total: int
    overall_correct: int
    overall_accuracy: float


class DashboardComparison(BaseModel):
    subjects: list[SubjectComparison]
    total_users: int


@router.get("/comparison", response_model=DashboardComparison)
def comparison(user_id: str, db: Session = Depends(get_db)) -> DashboardComparison:
    rows = (
        db.query(QuizAttempt, QuizQuestion.subject)
        .join(QuizQuestion, QuizAttempt.question_id == QuizQuestion.id)
        .all()
    )

    mine: dict[str, dict[str, int]] = {}
    overall: dict[str, dict[str, int]] = {}
    user_ids: set[str] = set()

    for attempt, subject in rows:
        user_ids.add(attempt.user_id)

        overall_bucket = overall.setdefault(subject, {"total": 0, "correct": 0})
        overall_bucket["total"] += 1
        if attempt.is_correct:
            overall_bucket["correct"] += 1

        if attempt.user_id == user_id:
            my_bucket = mine.setdefault(subject, {"total": 0, "correct": 0})
            my_bucket["total"] += 1
            if attempt.is_correct:
                my_bucket["correct"] += 1

    subjects = [
        SubjectComparison(
            subject=subject,
            my_total=mine.get(subject, {"total": 0})["total"],
            my_correct=mine.get(subject, {"correct": 0})["correct"],
            my_accuracy=(
                round(mine[subject]["correct"] / mine[subject]["total"] * 100, 1)
                if subject in mine
                else 0.0
            ),
            overall_total=data["total"],
            overall_correct=data["correct"],
            overall_accuracy=round(data["correct"] / data["total"] * 100, 1),
        )
        for subject, data in sorted(overall.items())
    ]
    return DashboardComparison(subjects=subjects, total_users=len(user_ids))
