import redis

from config import DEFAULT_REDIS_EXPIRATION
from src.utils.custom_print import CustomPrint

printer = CustomPrint()

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def clear_redis_values():
    redis_client.flushdb()
    printer.success("Redis cleared.")

def get_value_from_redis(key):
    return redis_client.get(key)

def remove_value_from_redis(key):
    redis_client.delete(key)
    printer.success(f"{key} deleted from Redis.")

def store_value_in_redis(key, value, expiration = DEFAULT_REDIS_EXPIRATION):
    try:
        redis_client.set(key, value)
        redis_client.expire(key, expiration)
    except Exception as e:
        printer.error(f"Error storing value in Redis: {e}")