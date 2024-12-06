import requests
from types import SimpleNamespace

DEFAULT_REDIS_EXPIRATION = 36000 # 10 hours

REDIS_KEYS = SimpleNamespace(
    ACCESS_TOKEN="access_token",
    EMAILS="emails",
    EMAIL_ADDRESS="email_address",
    REFRESH_TOKEN="refresh_token",
)

stopwords_list = requests.get("https://gist.githubusercontent.com/rg089/35e00abf8941d72d419224cfd5b5925d/raw/12d899b70156fd0041fa9778d657330b024b959c/stopwords.txt").content
stopwords = set(stopwords_list.decode().splitlines()) 
stopwords.update([
    "com", "email", "gmail", 
    "need", "san", "subject", "thing", 
    "today", "unsubscribe",
])
