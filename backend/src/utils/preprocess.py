import html
import re
from bs4 import BeautifulSoup
from nltk.stem import WordNetLemmatizer
from config import stopwords

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
        print("Cleaning complete.")
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
        print("Lemmatizing complete.")
        return df
    except Exception as e:
        print(f"Error lemmatizing body: {e}")
        return df

def clean_and_tokenize(text):
    if not isinstance(text, str):
        return []
    words = text.lower().split()
    return [word for word in words if word.isalpha() and word not in stopwords]