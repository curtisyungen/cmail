import html
import re
import emoji
from bs4 import BeautifulSoup
from nltk.stem import WordNetLemmatizer
from config import stopwords

lemmatizer = WordNetLemmatizer()

def clean_text(text):
    try: 
        if not isinstance(text, str): return ""
        text = html.unescape(text)

        # Trying to remove HTML tags
        if "<" in text and ">" in text: 
            soup = BeautifulSoup(text, 'html.parser')
            text = soup.get_text()

        text = emoji.replace_emoji(text, replace='')
        text = re.sub(r'http\S+|www\S+|https\S+', '', text) # URLs
        text = re.sub(r'\S+@\S+', '', text) # emails
        text = re.sub(r'=\S+', ' ', text) # encodings
        text = re.sub(r'[^\w\s]', '', text) # punctuation and special chars
        text = re.sub(r'\s+', ' ', text).strip() # whitespaces
        return text
    except Exception as e:
        print(f"Error cleaning text: {e}")
        return text

def lemmatize_text(text):
    try:
        if not text:
            return ""
        words = text.split()
        lemmatized_words = [
            lemmatizer.lemmatize(word.lower()) for word in words 
            if word.lower() not in stopwords
        ]
        return ' '.join(lemmatized_words)
    except Exception as e:
        print(f"Error lemmatizing text: {e}")
        return text

def clean_and_tokenize(text):
    if not isinstance(text, str):
        return []
    words = text.lower().split()
    return [word for word in words if word.isalpha() and word not in stopwords]