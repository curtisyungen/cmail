import html
import re
import emoji
from bs4 import BeautifulSoup
from nltk.stem import WordNetLemmatizer
from config import stopwords as default_stopwords

lemmatizer = WordNetLemmatizer()

def get_stopwords(custom_stopwords=[]):
    try:
        lowercase_stopwords = {word.lower() for word in default_stopwords}
        if custom_stopwords:
            lowercase_custom_stopwords = {word.lower() for word in custom_stopwords}
            return lowercase_stopwords.union(lowercase_custom_stopwords)
        return lowercase_stopwords
    except Exception as e:
        print(f"Error getting stopwords: {e}")
        return []

def clean_html(original_text):
    text = html.unescape(original_text)
    soup = BeautifulSoup(original_text, 'html.parser')
    for tag_to_remove in soup(['a', 'script', 'style', 'head', 'title']):
        tag_to_remove.decompose()
    remove_selectors = [
        "footer",
        "aside",
        "div[class*='footer']",
        "div[class*='unsubscribe']",
        "div[class*='privacy']",
        "span",
    ]
    for selector in remove_selectors:
        for element in soup.select(selector):
            element.decompose()
    text = soup.get_text(separator=' ')
    return text.strip()

def clean_text(text):
    try: 
        if not isinstance(text, str): return ""
        text = remove_previous_messages(text)
        text = clean_html(text)
        text = emoji.replace_emoji(text, replace='')
        text = re.sub(r'http\S+|www\S+|https\S+', '', text) # URLs
        text = re.sub(r'\S+@\S+', '', text) # emails
        text = re.sub(r'=\S+', ' ', text) # encodings
        text = re.sub(r'[^\w\s]', '', text) # punctuation and special chars
        text = re.sub(r'\s+', ' ', text).strip() # whitespaces
        text = re.sub(r'\n+', ' ', text) # line-breaks
        text = re.sub(
            r'(?i)(unsubscribe|opt-out|privacy|terms|contact us|email preferences|'
            r'sent from my.*device|sign up here|copyright.*\d{4}|all rights reserved)',
            '', text
        )
        return text
    except Exception as e:
        print(f"Error cleaning text: {e}")
        return text

def lemmatize_text(text, stopwords):
    try:
        if not text:
            return ""
        words = text.split()
        lemmatized_words = [
            lemmatizer.lemmatize(word)
            for word in words
            if word.lower() not in stopwords
        ]
        return ' '.join(lemmatized_words)
    except Exception as e:
        print(f"Error lemmatizing text: {e}")
        return text

# Remove previous messages quoted in the email body
def remove_previous_messages(text):
    regex_list = [
        r'<div\s+class="gmail_quote">',
        r'On \w{3,9}, \w{3,9} \d{1,2}, \d{4} at \d{1,2}:\d{2}:\d{2} (AM|PM) [A-Z]{3,4}',
        r'^On\s+[A-Za-z]+,\s+[A-Za-z]+ \d{1,2},\s+\d{4}\s+at\s+\d{1,2}:\d{2}$'
    ]
    for regex in regex_list:
        match = re.search(regex, text)
        if match:
            text = text[:match.start()]
            break
    return text.strip()

def clean_and_lemmatize(text, stopwords):
    cleaned_text = clean_text(text)
    lemmatized = lemmatize_text(cleaned_text, stopwords)
    return lemmatized

def clean_and_tokenize(text, stopwords):
    if not isinstance(text, str):
        return []
    words = text.lower().split()
    return [word for word in words if word.isalpha() and word not in stopwords]