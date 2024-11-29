import html
import json
import mailbox
import re
from bs4 import BeautifulSoup
from config import EMAILS, MBOX_DATA
from datetime import datetime
from email.header import decode_header, Header

def is_valid_body(content):
    if isinstance(content, list):
        content = " ".join(content)
    excessive_spaces = len(re.findall(r'\s', content)) > 0.5 * len(content)
    excessive_non_alpha = len(re.findall(r'[^a-zA-Z0-9\s]', content)) > 0.3 * len(content)
    excessive_encoding = bool(re.search(r'(doctype|obj|stream|endobj|flatedecode|xobject)', content.lower()))
    return not (excessive_spaces or excessive_non_alpha or excessive_encoding)

def clean_email_data(email_data):
    def clean_text(text):
        if not isinstance(text, str): return ""

        text = html.unescape(text)

        # Trying to remove HTML tags
        if '<' in text and '>' in text:
            soup = BeautifulSoup(text, 'html.parser')
            text = soup.get_text()
        text = re.sub(r'<[^>]*>', '', text)

        text = re.sub(r'http\S+|www\S+|https\S+', '', text) # URLs
        text = re.sub(r'\S+@\S+', '', text) # emails
        text = re.sub(r'=(09|20|0A|0D)', ' ', text) # encodings
        text = re.sub(r'[^\w\s]', '', text) # punctuation and special chars
        text = re.sub(r'\s+', ' ', text).strip() # whitespaces

        return text
    
    def lower_text(text):
        return ''.join(char.lower() if char.isalnum() or char.isspace() else ' ' for char in text)
    
    def decode_header_field(field):
        if not field:
            return ""
        if isinstance(field, str):
            return field
        decoded = decode_header(field)
        result = []
        for part, encoding in decoded:
            try:
                if isinstance(part, bytes):
                    decoded_part = part.decode(encoding or "utf-8")
                else:
                    decoded_part = part
                result.append(decoded_part)
            except (UnicodeDecodeError, TypeError, LookupError):
                result.append(part.decode('utf-8', errors='ignore') if isinstance(part, bytes) else part)
        
    def extract_details(field):
        if not field:
            return None, None
        if isinstance(field, Header):
            return None, None
        try:
            field = re.sub(r'[^\x00-\x7F]+', '', field) 
            match = re.match(r'(.*)<(.*)>', field)
            if match:
                name, email = match.groups()
                return name.strip(), email.strip()
            return None, field.strip()
        except:
            print(f"Error extracting details for field: {field}")
            return None, None
    
    def parse_date(date_str):
        try:
            dt = datetime.strptime(date_str, '%a, %d %b %Y %H:%M:%S %z')
            return int(dt.timestamp() * 1000)
        except ValueError:
            return date_str
    
    raw_subject = decode_header_field(email_data.get('subject', ''))
    email_data['raw_subject'] = clean_text(raw_subject) # This is really just for display on the front-end
    email_data['subject'] = lower_text(clean_text(raw_subject))

    if not is_valid_body(email_data.get('body', '')):
        email_data['body'] = ''

    raw_body = " ".join(email_data.get('body', ''))
    email_data['raw_body'] = clean_text(raw_body) # Just for displaying
    email_data['body'] = lower_text(clean_text(raw_body))

    sender_name, sender_email = extract_details(email_data.get('from', ''))
    recipient_name, recipient_email = extract_details(email_data.get('to', ''))

    email_data['from_name'] = sender_name
    email_data['from_email'] = sender_email
    email_data['to_name'] = recipient_name
    email_data['to_email'] = recipient_email

    date = email_data.get('date', '')
    if isinstance(date, str):
        date = parse_date(date)
    email_data['date'] = date
    return email_data

def mbox_to_json(email_count):
    print(f"Creating new JSON file with {email_count} emails...")
    mbox = mailbox.mbox(MBOX_DATA)
    messages = []

    for index, message in enumerate(mbox):
        if (index == email_count):
            break
        email_data = {
            "id": None,
            "subject": message["subject"],
            "from": message["from"],
            "to": message["to"],
            "date": message["date"],
            "body": message.get_payload(decode=True).decode('utf-8', errors='ignore') if message.is_multipart() is False else None,
            "raw_body": ""
        }
        if message.is_multipart():
            email_data["body"] = []
            for part in message.walk():
                if part.get_content_type() == "text/plain":
                    email_data["body"].append(part.get_payload(decode=True).decode('utf-8', errors='ignore'))
        cleaned_email_data = clean_email_data(email_data)
        cleaned_email_data['id'] = index
        messages.append(cleaned_email_data)

    with open(EMAILS, 'w', encoding='utf-8') as file:
        json.dump(messages, file, ensure_ascii=False, indent=4)

    