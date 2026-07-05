# 담당: 최수인 — 법령/개념 문서 저장 (문서 DB 구축, PRD 3.2 P0)
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import Document
from app.db.session import get_db

router = APIRouter(prefix="/api/documents", tags=["documents"])


class DocumentCreate(BaseModel):
    subject: str
    title: str
    content: str
    source: str | None = None


class DocumentOut(BaseModel):
    id: int
    subject: str
    title: str
    content: str
    source: str | None

    class Config:
        from_attributes = True


@router.post("", response_model=DocumentOut)
def create_document(payload: DocumentCreate, db: Session = Depends(get_db)) -> Document:
    document = Document(**payload.model_dump())
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


@router.get("", response_model=list[DocumentOut])
def list_documents(subject: str | None = None, db: Session = Depends(get_db)) -> list[Document]:
    query = db.query(Document)
    if subject:
        query = query.filter(Document.subject == subject)
    return query.order_by(Document.id.desc()).limit(100).all()
