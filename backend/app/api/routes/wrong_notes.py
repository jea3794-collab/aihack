# 담당: 최수인 — 오답노트 조회
from fastapi import APIRouter

router = APIRouter(prefix="/api/wrong-notes", tags=["wrong-notes"])


@router.get("")
def list_wrong_notes(user_id: str) -> list[dict]:
    # TODO: DB 조회로 교체
    return []
