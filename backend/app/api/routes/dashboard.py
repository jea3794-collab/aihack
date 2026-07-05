# 담당: 최수인 — 취약과목 대시보드 집계
from fastapi import APIRouter

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary")
def summary(user_id: str) -> dict:
    # TODO: 과목별 정답률 집계 쿼리로 교체
    return {"subjects": []}
