from redis import Redis
from json import dumps
from dotenv import load_dotenv
from os import environ

load_dotenv()
redis_host = environ["REDIS_HOST"]
redis_port = environ["REDIS_PORT"]
redis_memory_limit = environ["REDIS_MEMORY_LIMIT"]

redis_client = Redis(
    host=redis_host,
    port=redis_port,
    db=0,
)

memory_limit = 1024 * 1024 * int(redis_memory_limit)
response = redis_client.execute_command("CONFIG", "SET", "maxmemory", memory_limit)


def add_cache(key: str, data, json: bool):
    if json:
        data = dumps(data)
    redis_client.set(key, data)


def get_cache(key):
    return redis_client.get(key)
