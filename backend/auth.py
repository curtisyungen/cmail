import json
import requests
from google.oauth2.credentials import Credentials

CREDENTIALS_FILE = './credentials.json'

with open(CREDENTIALS_FILE, 'r') as f:
    creds_data = json.load(f)

CLIENT_ID = creds_data['web']['client_id']
CLIENT_SECRET = creds_data['web']['client_secret']
TOKEN_URI = creds_data['web']['token_uri']
REDIRECT_URI = creds_data['web']['redirect_uris'][1]

def exchange_code_for_token(auth_code):
    data = {
        'code': auth_code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code'
    }

    response = requests.post(TOKEN_URI, data=data)
    if response.status_code != 200:
        raise Exception('Failed to fetch tokens', response.json())

    tokens = response.json()
    access_token = tokens.get("access_token")
    refresh_token = tokens.get("refresh_token")
    token_uri = tokens.get("token_uri", TOKEN_URI)
    scopes = tokens.get("scope", "").split(" ")

    creds = Credentials(
        token=access_token,
        refresh_token=refresh_token,
        token_uri=token_uri,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=scopes
    )
    return creds