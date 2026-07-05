# 담당: 최성윤 — 하이브리드 검색 (키워드 + 벡터 결합)
# TODO: keyword_search, vector_search 결과를 RRF 등으로 결합

from app.services.search.keyword_search import keyword_search
from app.services.search.vector_search import vector_search


def hybrid_search(query: str, subject: str | None = None, top_k: int = 5) -> list[dict]:
    raise NotImplementedError
