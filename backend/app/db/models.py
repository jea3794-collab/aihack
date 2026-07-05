# 담당: 최수인 — PostgreSQL 스키마 정의
#
# TODO: 아래 초안을 기준으로 실제 컬럼/관계를 확정하세요.
# - Document: 법령/개념 코퍼스 (pgvector 임베딩 컬럼 포함 예정)
# - QuizQuestion: 과목별 기출문제 은행
# - WrongNote: 사용자 오답 기록

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)
    subject = Column(String, nullable=False)  # 물류관리론 / 물류관련법규 등
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String, nullable=True)  # 조문 번호 등 근거 표기용
    created_at = Column(DateTime, server_default=func.now())
    # embedding = Column(Vector(1536))  # pgvector — 검색 담당(최성윤)이 확정


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True)
    subject = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    choices = Column(Text, nullable=False)  # JSON string: ["...", ...]
    answer_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=True)


class WrongNote(Base):
    __tablename__ = "wrong_notes"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id"), nullable=False)
    user_id = Column(String, nullable=False)
    submitted_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    question = relationship("QuizQuestion")
