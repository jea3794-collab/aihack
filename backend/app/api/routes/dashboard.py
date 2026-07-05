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


class ExamReference(BaseModel):
    round: int
    year: int
    exam_date: str
    result_date: str
    applicants: int
    examinees: int
    attendance_rate: float
    passed: int
    pass_rate: float
    fail_rate: float
    fail_rate_note: str


# 제29회(2025년) 물류관리사 시험 실제 결과 (시행기관 발표 자료 기준).
# 과목별 과락률은 원자료에 없어 산출 불가 — 전체 응시/합격 인원 기준 수치만 제공.
EXAM_REFERENCE = ExamReference(
    round=29,
    year=2025,
    exam_date="2025-07-26",
    result_date="2025-08-27",
    applicants=12704,
    examinees=7948,
    attendance_rate=62.56,
    passed=2653,
    pass_rate=33.38,
    fail_rate=66.62,
    fail_rate_note="과락(과목별 40점 미만)과 평균 미달(60점 미만)을 모두 포함한 전체 불합격률이며, 과목별 과락률은 공개되지 않아 산출할 수 없습니다.",
)


@router.get("/exam-reference", response_model=ExamReference)
def exam_reference() -> ExamReference:
    return EXAM_REFERENCE
