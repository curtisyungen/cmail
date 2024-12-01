import redis

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def clear_redis_values():
    redis_client.flushall()
    print("Redis cleared.")

def get_value_from_redis(key):
    return redis_client.get(key)

def store_value_in_redis(key, value, expiration = 3600):
    try:
        redis_client.set(key, value)
        redis_client.expire(key, expiration)
    except Exception as e:
        print(f"Error storing value in Redis: {e}")