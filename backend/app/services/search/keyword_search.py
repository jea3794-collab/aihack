# 담당: 최성윤 — 키워드(정확 일치) 검색
# TODO: PostgreSQL full-text search (tsvector) 기반으로 고도화 (현재는 ILIKE 기반 MVP)
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.models import Document


def keyword_search(db: Session, query: str, subject: str | None = None, top_k: int = 5) -> list[dict]:
    q = db.query(Document)
    if subject:
        q = q.filter(Document.subject == subject)

    terms = [t for t in query.replace("?", " ").split() if t]
    if terms:
        conditions = [
            or_(Document.title.ilike(f"%{t}%"), Document.content.ilike(f"%{t}%"))
            for t in terms
        ]
        q = q.filter(or_(*conditions))

    documents = q.limit(top_k).all()
    return [
        {
            "id": d.id,
            "subject": d.subject,
            "title": d.title,
            "content": d.content,
            "source": d.source,
        }
        for d in documents
    ]
