import json
import mailbox
import re
from datetime import datetime
from config import GMAIL_MAX_EMAILS
from email.header import decode_header, Header

def clean_and_tokenize(text):
    words = text.lower().split()
    return [word for word in words if word.isalpha()]

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
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        text = ''.join(char.lower() if char.isalnum() or char.isspace() else ' ' for char in text)
        return re.sub(r'\s+', ' ', text).strip()
    
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
        
    email_data['subject'] = clean_text(decode_header_field(email_data.get('subject', '')))

    if not is_valid_body(email_data['body']):
        email_data['body'] = ''

    email_data['body'] = clean_text(" ".join(email_data.get('body', '')))

    from_field = email_data.get('from', '')
    to_field = email_data.get('to', '')
    if isinstance(from_field, Header):
        print(f"from_field: {from_field}")
    sender_name, sender_email = extract_details(from_field)
    recipient_name, recipient_email = extract_details(to_field)

    email_data['from_name'] = sender_name
    email_data['from_email'] = sender_email
    email_data['to_name'] = recipient_name
    email_data['to_email'] = recipient_email

    date = email_data.get('date', '')
    if isinstance(date, str):
        date = parse_date(date)
    email_data['date'] = date
    return email_data

def mbox_to_json(mbox_file, output_json_file):
    print("Creating new JSON file...")
    mbox = mailbox.mbox(mbox_file)
    messages = []

    counter = 0
    for message in mbox:
        email_data = {
            "subject": message["subject"],
            "from": message["from"],
            "to": message["to"],
            "date": message["date"],
            "body": message.get_payload(decode=True).decode('utf-8', errors='ignore') if message.is_multipart() is False else None,
        }
        if message.is_multipart():
            email_data["body"] = []
            for part in message.walk():
                if part.get_content_type() == "text/plain":
                    email_data["body"].append(part.get_payload(decode=True).decode('utf-8', errors='ignore'))
        cleaned_email_data = clean_email_data(email_data)
        messages.append(cleaned_email_data)
        counter += 1

        #if (counter == GMAIL_MAX_EMAILS):
            #break

    with open(output_json_file, 'w', encoding='utf-8') as file:
        json.dump(messages, file, ensure_ascii=False, indent=4)

    