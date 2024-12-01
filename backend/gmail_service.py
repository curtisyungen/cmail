import pandas as pd
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from utils import decode_base64url
from redis_cache import get_value_from_redis
from config import REDIS_KEYS

def fetch_emails(creds, limit = 10):
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())

    print(f"fetching {limit} emails...")

    emails = get_value_from_redis(REDIS_KEYS.EMAILS)
    if emails:
        emails_df = pd.read_json(emails)
    else:
        emails_df = None

    if emails_df is not None and not emails_df.empty:
        print(f"Emails loaded from Redis.")
        return emails, True
    
    service = build('gmail', 'v1', credentials=creds)
    query='label:inbox OR -label:spam -label:sent -label:archive -label:trash'
    results = service.users().messages().list(userId='me', q=query, maxResults=limit).execute()
    messages = results.get('messages', [])

    emails = []
    for message in messages:
        msg = service.users().messages().get(userId='me', id=message['id']).execute()
        email_data = {
            'id': msg['id'],
            'subject': '',
            'from': '',
            'to': '',
            'date': '',
            'body': ''
        }

        for header in msg['payload']['headers']:
            if header['name'] == 'Subject':
                email_data['subject'] = header['value']
            if header['name'] == 'From':
                email_data['from'] = header['value']
            if header['name'] == 'Date':
                email_data['date'] = header['value']
            if header['name'] == 'To':
                email_data['to'] = header['value']

        if 'parts' in msg['payload']:
            for part in msg['payload']['parts']:
                if part['mimeType'] == 'text/plain':
                    email_data['body'] = part['body'].get('data', '')
                elif part['mimeType'] == 'text/html':
                    email_data['body'] = part['body'].get('data', '')
        else:
            email_data['body'] = msg['payload'].get('body', {}).get('data', '')

        email_data['body'] = decode_base64url(email_data['body'])
        emails.append(email_data)

    return pd.DataFrame(emails), False