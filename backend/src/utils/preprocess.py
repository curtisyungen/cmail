import re
import requests
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
stopwords_list = requests.get("https://gist.githubusercontent.com/rg089/35e00abf8941d72d419224cfd5b5925d/raw/12d899b70156fd0041fa9778d657330b024b959c/stopwords.txt").content
stopwords = set(stopwords_list.decode().splitlines()) 
stopwords.update(["completed", "curtis", "need", "subject", "thing", "today", "unsubscribe", "yungen"])

def clean_body(df):
    print("Cleaning data...")
    try:
        def clean(body):
            if not body:
                return ""
            body = re.sub(r'http\S+|www\S+|https\S+', '', body) # URLs
            body = re.sub(r'\S+@\S+', '', body) # emails
            body = re.sub(r'=(09|20|0A|0D)', ' ', body) # encodings
            body = re.sub(r'[^\w\s]', '', body) # punctuation and special chars
            body = re.sub(r'\s+', ' ', body).strip() # whitespaces
            words = body.split()
            lemmatized_words = [lemmatizer.lemmatize(word.lower()) for word in words if word.lower() not in stopwords]
            return ' '.join(lemmatized_words)
        df['body'] = df['body'].apply(clean)
        return df
    except Exception as e:
        print(f"Error cleaning body: {e}")
        return df

def clean_and_tokenize(text):
    words = text.lower().split()
    return [word for word in words if word.isalpha()]
