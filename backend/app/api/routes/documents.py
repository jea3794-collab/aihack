# 담당: 최수인 — 법령/개념 문서 저장 (문서 DB 구축, PRD 3.2 P0)
import io

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from pypdf import PdfReader
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


@router.post("/upload", response_model=DocumentOut)
def upload_document(
    subject: str = Form(...),
    title: str | None = Form(None),
    source: str | None = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> Document:
    if not (file.filename or "").lower().endswith(".pdf") and file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="PDF 파일만 업로드할 수 있습니다.")

    raw = file.file.read()
    try:
        reader = PdfReader(io.BytesIO(raw))
        text = "\n".join(page.extract_text() or "" for page in reader.pages).strip()
    except Exception:
        raise HTTPException(status_code=400, detail="PDF 파일을 읽을 수 없습니다.")

    if not text:
        raise HTTPException(
            status_code=400,
            detail="PDF에서 텍스트를 추출하지 못했습니다. 스캔된 이미지 PDF일 수 있습니다.",
        )

    document = Document(
        subject=subject,
        title=title or (file.filename or "문서").rsplit(".", 1)[0],
        content=text,
        source=source,
    )
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
