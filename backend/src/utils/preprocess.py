import html
import re
import emoji
from bs4 import BeautifulSoup
from nltk.stem import WordNetLemmatizer
from config import stopwords

lemmatizer = WordNetLemmatizer()

def clean_text(df, column):
    print(f"Cleaning {column} column...")
    try: 
        def clean(text):
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
        df[f'raw_{column}'] = df[column]
        df[column] = df[column].apply(clean)
        print(f"Cleaning {column} complete.")
        return df
    except Exception as e:
        print(f"Error cleaning {column}: {e}")
        return df

def lemmatize_body(df):
    print("Lemmatizing bodies...")
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