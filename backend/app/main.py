from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import dashboard, documents, qa, quiz, wrong_notes
from app.db.seed import seed_if_empty
from app.db.session import Base, SessionLocal, engine

app = FastAPI(title="PassMate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)
app.include_router(qa.router)
app.include_router(quiz.router)
app.include_router(wrong_notes.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
