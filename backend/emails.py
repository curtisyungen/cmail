import pandas as pd
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from io import StringIO
from redis_cache import get_value_from_redis, store_value_in_redis
from utils import decode_base64url
from config import REDIS_KEYS
from src.utils.preprocess import clean_text

MAX_EMAILS = 500
QUERY = 'label:inbox OR -label:spam -label:sent -label:archive -label:trash'

def fetch_emails(creds, limit):
    print(f"Fetching emails from API...")
    
    service = build('gmail', 'v1', credentials=creds)
    next_page_token = None

    messages = []
    while len(messages) < limit:
        try:
            results = service.users().messages().list(
                userId='me', 
                q=QUERY, 
                maxResults=min(MAX_EMAILS, limit - len(messages)),
                pageToken=next_page_token
            ).execute()
            messages.extend(results.get('messages', []))
            next_page_token = results.get('nextPageToken')
            if not next_page_token:
                break
        except Exception as e:
            print(f"Error fetching emails: {e}")
            break

    emails = []
    for message in messages:
        try:
            msg = service.users().messages().get(userId='me', id=message['id']).execute()
            payload = msg.get('payload', {})
            headers = {header['name']: header['value'] for header in payload.get('headers', [])}
            email_data = {
                'id': msg['id'],
                'labelIds': msg.get('labelIds', []),
                'subject': headers.get('Subject', ''),
                'from': headers.get('From', ''),
                'to': headers.get('To', ''),
                'date': headers.get('Date', ''),
                'body': ''
            }
            body = ""
            if 'parts' in payload:
                for part in payload['parts']:
                    if part['mimeType'] == 'text/plain' and not body:
                        body = part['body'].get('data', '')
                    elif part['mimeType'] == 'text/html':
                        body = part['body'].get('data', body)
            else:
                body = payload.get('body', {}).get('data', '')
            email_data['body'] = decode_base64url(body)
            emails.append(email_data)
        except Exception as e:
            print(f"Error getting message details: {e}")
            
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

        emails_df['raw_body'] = emails_df['body']
        emails_df['raw_subject'] = emails_df['subject']
        emails_df['body'] = emails_df['body'].apply(clean_text)
        emails_df['subject'] = emails_df['subject'].apply(clean_text)

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