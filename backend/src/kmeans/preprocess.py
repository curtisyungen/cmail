import re
import requests
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
stopwords_list = requests.get("https://gist.githubusercontent.com/rg089/35e00abf8941d72d419224cfd5b5925d/raw/12d899b70156fd0041fa9778d657330b024b959c/stopwords.txt").content
stopwords = set(stopwords_list.decode().splitlines()) 
stopwords.update(["completed", "curtis", "need", "subject", "thing", "today", "unsubscribe", "yungen"])

def clean_data(df):
    print("Cleaning data...")
    def clean_body(body):
        if not body:
            return ""
        body = re.sub(r'=(09|20|0A|0D)', ' ', body)
        body = re.sub(r'\s+', ' ', body).strip()
        body = re.sub(r'[^\w\s]', '', body)
        words = body.split()
        lemmatized_words = [lemmatizer.lemmatize(word.lower()) for word in words if word.lower() not in stopwords]
        return ' '.join(lemmatized_words)
    
    df['body'] = df['body'].apply(clean_body)
    return df
