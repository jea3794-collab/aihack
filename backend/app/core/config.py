from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://logimentor:logimentor@localhost:5432/logimentor"
    redis_url: str = "redis://localhost:6379/0"
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
