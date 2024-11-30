import redis
import pandas as pd

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

EMAILS_KEY = "emails"

def clear_emails_from_redis():
    redis_client.delete(EMAILS_KEY)
    print(f"Emails cleared from Redis.")

def get_emails_from_redis():
    emails_json = redis_client.get(EMAILS_KEY)
    if not emails_json:
        return None
    return pd.read_json(emails_json)

def store_emails_in_redis(emails_df):
    redis_client.set(EMAILS_KEY, emails_df.to_json(orient='records'))
    redis_client.expire(EMAILS_KEY, 3600)
    print(f"Emails stored in Redis.")