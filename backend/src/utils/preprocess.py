import html
import json
import pandas as pd
import re
from bs4 import BeautifulSoup
from nltk.stem import WordNetLemmatizer
from config import EMAILS, stopwords

lemmatizer = WordNetLemmatizer()

def clean_body(df):
    print("Cleaning body...")
    try: 
        def clean(text):
            if not isinstance(text, str): return ""

            text = html.unescape(text)

            # Trying to remove HTML tags
            soup = BeautifulSoup(text, 'html.parser')
            text = soup.get_text()

            text = re.sub(r'http\S+|www\S+|https\S+', '', text) # URLs
            text = re.sub(r'\S+@\S+', '', text) # emails
            text = re.sub(r'=\S+', ' ', text) # encodings
            text = re.sub(r'[^\w\s]', '', text) # punctuation and special chars
            text = re.sub(r'\s+', ' ', text).strip() # whitespaces

            return text
        df['body'] = df['body'].apply(clean)
        return df
    except Exception as e:
        print(f"Error cleaning body: {e}")
        return df
    
def lemmatize_body(df):
    print("Lemmatizing body...")
    try:
        def lemmatize(body):
            if not body:
                return ""
            words = body.split()
            lemmatized_words = [
                lemmatizer.lemmatize(word.lower()) for word in words 
                if word.lower() not in stopwords
            ]
            return ' '.join(lemmatized_words)
        df['body'] = df['body'].apply(lemmatize)
        return df
    except Exception as e:
        print(f"Error lemmatizing body: {e}")
        return df

def clean_and_tokenize(text):
    words = text.lower().split()
    return [word for word in words if word.isalpha()]

def load_data():
    print("Loading data...")
    data = []
    with open(EMAILS, 'r', encoding="utf-8") as file:
        data = json.load(file)
    cleaned_df = clean_body(pd.DataFrame(data))
    final_df = lemmatize_body(cleaned_df)
    print("Loading complete.")
    return final_df