from redis import Redis
from json import dumps

redis_client = Redis(host="localhost", port=6379, db=0)


def add_cache(key: str, data, json: bool):
    if json:
        data = dumps(data)
    redis_client.set(key, data)


def get_cache(key):
    return redis_client.get(key)
