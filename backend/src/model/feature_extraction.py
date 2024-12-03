from collections import Counter
from datetime import datetime
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer

def compute_sender_freqs(sender_column):
    try:
        sender_column = sender_column.fillna("").astype(str)

        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        cleaned_senders = sender_column.apply(lambda x: re.sub(r'\s+|<.*?>', '', x).strip())
        valid_senders = cleaned_senders[cleaned_senders.apply(lambda x: re.match(email_regex, x) is not None)]

        sender_counts = Counter(valid_senders)
        total_senders = len(valid_senders)

        if total_senders == 0:
            return {}
        
        sender_freqs = {sender: count / total_senders for sender, count in sender_counts.items()}
        return sender_freqs
    except Exception as e:
        print(f"Error computing sender frequencies: {e}")
        return {}
    
def encode_column(column_data):
    try:
        all_words = set()
        for text in column_data:
            words = text.split()
            all_words.update(words)
        word_to_index = {word: idx for idx, word in enumerate(sorted(all_words))}
        encoded_text = []
        for text in column_data:
            words = text.split()
            vector = [0] * len(word_to_index)
            for word in words:
                if word in word_to_index:
                    vector[word_to_index[word]] = 1
            encoded_text.append(vector)
        return pd.DataFrame(encoded_text, columns=list(word_to_index.keys()))
    except Exception as e:
        print(f"Error encoding text: {e}")
        return pd.DataFrame()

def process_time(timestamp):
    try:
        if isinstance(timestamp, pd.Timestamp):
            date_time = timestamp
        elif isinstance(timestamp, (int, float)):
            date_time = datetime.fromtimestamp(timestamp / 1000)
        else:
            date_time = None
        
        if date_time:
            return {
                "hour": date_time.hour / 23.0,
                "day": date_time.day / 31.0,
                "weekday": date_time.weekday() / 6.0
            }
        else:
            return {
                "hour": 0,
                "day": 0,
                "weekday": 0
            }
    except Exception as e:
        print(f"Error processing time: {e}")
        return None

def run_tfidf(df, column):
    try:
        if df[column].isnull().any():
            print(f"Warning: Found null values in '{column}' column")
            df = df.dropna(subset=[column])
        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000, ngram_range=(1, 3))
        tfidf_matrix = vectorizer.fit_transform(df[column])
        tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), columns=vectorizer.get_feature_names_out())
        tfidf_df.columns = [f"{column}_tfidf_{col}" for col in tfidf_df.columns]
        return tfidf_df
    except Exception as e:
        print(f"Error running tfidf on {column}: {e}")
        return pd.DataFrame()

def extract_senders(sender_column):
    try:
        cleaned_senders = sender_column.apply(lambda x: x.strip().lower() if isinstance(x, str) else "")
        sender_freqs = compute_sender_freqs(cleaned_senders)
        sender_df = cleaned_senders.apply(lambda sender: sender_freqs.get(sender, 0)).to_frame(name='sender_freq')
        return sender_df
    except Exception as e:
        print(f"Error extracting senders: {e}")
        return pd.DataFrame()
    
def get_body_df(df, use_tfidf):
    if use_tfidf:
        return run_tfidf(df, 'body')
    return encode_column(df['body']) # Encoding for Autoencoder or BERT
    
def get_subject_df(df, include_subject, use_tfidf):
    if not include_subject:
        return pd.DataFrame()
    if use_tfidf:
        return run_tfidf(df, 'subject')
    return encode_column(df['subject']) # Encoding for Autoencoder or BERT

def extract_features_from_dataframe(df, include_labels, include_senders, include_subject, use_tfidf):
    try:
        print(f"Extracting features...")

        body_df = get_body_df(df, use_tfidf)
        subject_df = get_subject_df(df, include_subject, use_tfidf)
        labels_df = encode_column(df['labelIds']) if include_labels else pd.DataFrame()
        senders_df = extract_senders(df['from']) if include_senders else pd.DataFrame()

        final_df = body_df
        other_dfs = [subject_df, labels_df, senders_df]
        for other_df in other_dfs:
            if not other_df.empty:
                final_df = pd.concat([final_df, other_df], axis=1)

        print(f"Feature extraction complete. Final shape: {final_df.shape}.")
        return final_df
    except Exception as e:
        print(f"Error extracting features: {e}")
        return pd.DataFrame()