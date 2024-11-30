import json
import requests
from flask import jsonify, session
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

CREDENTIALS_FILE = './credentials.json'

with open(CREDENTIALS_FILE, 'r') as f:
    creds_data = json.load(f)

CLIENT_ID = creds_data['web']['client_id']
CLIENT_SECRET = creds_data['web']['client_secret']
TOKEN_URI = creds_data['web']['token_uri']
REDIRECT_URI = creds_data['web']['redirect_uris'][1]
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

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

    store_tokens(access_token=access_token, refresh_token=refresh_token)

def get_creds():
    try:
        access_token = session.get('access_token')
        refresh_token = session.get('refresh_token')

        if not access_token or not refresh_token:
            return None
        
        creds = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri=TOKEN_URI,
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            scopes=SCOPES
        )

        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        return creds
    except Exception as e:
        print(f"Error retrieving credentials: {e}")
        return None

def store_tokens(access_token, refresh_token):
    try:
        session['access_token'] = access_token
        session['refresh_token'] = refresh_token
        print("Tokens successfully stored.")
        return jsonify({'message': 'User authenticated.'})
    except Exception as e:
        print(f"Error storing tokens: {e}")
        return jsonify({'message': 'Error storing tokens.'})