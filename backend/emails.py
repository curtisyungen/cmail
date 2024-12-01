import pandas as pd
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from io import StringIO
from redis_cache import get_value_from_redis, store_value_in_redis
from utils import decode_base64url
from config import REDIS_KEYS
from src.utils.preprocess import clean_text

def fetch_emails(creds, limit):
    print(f"Fetching emails from API...")
    
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
            'body': '',
            'labelIds': msg['labelIds']
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

    return pd.DataFrame(emails)

def get_emails(creds, limit):
    try: 
        if not creds:
            return None
        
        emails = get_value_from_redis(REDIS_KEYS.EMAILS)
        if emails:
            return pd.read_json(StringIO(emails))
        
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())

        emails_df = fetch_emails(creds, limit)
        if emails_df is None or emails_df.empty:
            return None

        emails_df = clean_text(emails_df, 'body')
        emails_df = clean_text(emails_df, 'subject')
        store_value_in_redis(REDIS_KEYS.EMAILS, emails_df.to_json(orient='records'))

        return emails_df
    except Exception as e:
        print(f"Error getting emails: {e}")
        return None
    
def fetch_labels(creds):
    try:
        service = build('gmail', 'v1', credentials=creds)
        results = service.users().labels().list(userId='me').execute()
        labels = results.get('labels', [])
        return labels
    except Exception as e:
        print(f"Error fetching labels: {e}")
        return []