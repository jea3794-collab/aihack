# 담당: 최성윤 — Cache-aside + TTL
import redis

from app.core.config import settings

redis_client = redis.from_url(settings.redis_url, decode_responses=True)

DEFAULT_TTL_SECONDS = 60 * 10


def get_cached(key: str) -> str | None:
    return redis_client.get(key)


def set_cached(key: str, value: str, ttl: int = DEFAULT_TTL_SECONDS) -> None:
    redis_client.set(key, value, ex=ttl)
