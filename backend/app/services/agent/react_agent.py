# 담당: 정재우 — ReAct Agent (문서 검색 → 답변 생성 → 근거 검증)
# TODO: Thought -> Act(hybrid_search) -> Observe -> Reflection 루프 구현
# 호출 횟수 상한을 반드시 두어 무한루프를 방지할 것 (PRD 6장 리스크 참고)

MAX_STEPS = 3


def answer_question(question: str) -> dict:
    raise NotImplementedError
