import redis

from config import DEFAULT_REDIS_EXPIRATION

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def clear_redis_values():
    redis_client.flushdb()
    print("Redis cleared.")

def get_value_from_redis(key):
    return redis_client.get(key)

def remove_value_from_redis(key):
    redis_client.delete(key)
    print(f"{key} deleted from Redis.")

def store_value_in_redis(key, value, expiration = DEFAULT_REDIS_EXPIRATION):
    try:
        redis_client.set(key, value)
        redis_client.expire(key, expiration)
    except Exception as e:
        print(f"Error storing value in Redis: {e}")