import json
import pandas as pd
import re
from nltk.stem import WordNetLemmatizer
from config import EMAILS, stopwords

lemmatizer = WordNetLemmatizer()

def clean_body(df):
    print("Cleaning data...")
    try:
        def clean(body):
            if not body:
                return ""
            words = body.split()
            lemmatized_words = [
                lemmatizer.lemmatize(word.lower()) for word in words 
                if word.lower() not in stopwords
            ]
            return ' '.join(lemmatized_words)
        df['body'] = df['body'].apply(clean)
        return df
    except Exception as e:
        print(f"Error cleaning body: {e}")
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
    print("Loading complete.")
    return cleaned_df