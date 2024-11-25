import os

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT_DIR, 'data')
SRC_DIR = os.path.join(ROOT_DIR, 'src')

ENRON_DATA = os.path.join(DATA_DIR, 'enron_emails.json')
GMAIL_DATA = os.path.join(DATA_DIR, 'gmailMail.json')
MBOX_DATA = os.path.join(DATA_DIR, 'emails.mbox')
QUOTES_DATA = os.path.join(DATA_DIR, 'quotes.jsonl')

# k-means
NUM_CLUSTERS = 12

GMAIL_MAX_EMAILS = 1200
