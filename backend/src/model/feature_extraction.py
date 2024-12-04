from collections import Counter
import numpy as np
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer

def compute_sender_freqs(sender_column):
    # Some senders have <email@gmail.com>; others, such as emails sent to self, are just email@gmail.com
    def extract_email_address(sender):
        try:
            if '<' in sender and '>' in sender:
                email = re.search(r'<(.*?)>', sender)
                if email:
                    return email.group(1).strip().lower()
            return sender.strip().lower()
        except Exception as e:
            print(f"Error extracting email address: {e}")
            return ""
    
    try:
        sender_column = sender_column.fillna("").astype(str)
        cleaned_senders = sender_column.apply(extract_email_address)
        sender_counts = Counter(cleaned_senders)
        print(f"sender_counts: {sender_counts}")
        total_senders = len(cleaned_senders)
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

def extract_date(datetime_column):
    try:
        datetime_column = pd.to_datetime(datetime_column)
        timestamps = (datetime_column.astype(np.int64) // 10**9).astype(int)
        day_of_week = datetime_column.dt.dayofweek
        hour_of_day = datetime_column.dt.hour
        return pd.DataFrame({
            'timestamp': timestamps,
            'day_of_week': day_of_week,
            'hour_of_day': hour_of_day
        })
    except Exception as e:
        print(f"Error extracting date: {e}")
        return pd.DataFrame()

def extract_senders(sender_column):
    try:
        sender_freqs = compute_sender_freqs(sender_column)
        sender_df = sender_column.apply(lambda sender: sender_freqs.get(sender, 0)).to_frame(name='sender_freq')
        print(f"sender_df: {sender_df}")
        return sender_df
    except Exception as e:
        print(f"Error extracting senders: {e}")
        return pd.DataFrame()
    
def extract_thread_ids(thread_id_column, include_thread_ids, encode_thread_ids):
    try:
        if not include_thread_ids:
            return pd.DataFrame()
        # For K-means and/or Autoencoder
        if encode_thread_ids:
            thread_id_to_index = {thread_id: idx for idx, thread_id in enumerate(sorted(set(thread_id_column)))}
            encoded_thread_ids = [int(thread_id_to_index[thread_id]) for thread_id in thread_id_column]
            return pd.DataFrame(encoded_thread_ids, columns=["encoded_threadId"])
        # For HDBSCAN
        return pd.DataFrame(thread_id_column, columns=["threadId"])
    except Exception as e:
        print(f"Error extracting thread IDs: {e}")
        return pd.DataFrame()
    
def get_body_df(df, use_tfidf):
    if use_tfidf:
        return run_tfidf(df, 'body')
    return encode_column(df['body']) # Encoding for Autoencoder or BERT
    
def get_subject_df(df, use_tfidf):
    if use_tfidf:
        return run_tfidf(df, 'subject')
    return encode_column(df['subject']) # Encoding for Autoencoder or BERT

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

def extract_features_from_dataframe(df, feature_config, model):
    try:
        include_bodies = feature_config.get('include_bodies')
        include_dates = feature_config.get('include_dates')
        include_labels = feature_config.get('include_labels')
        include_senders = feature_config.get('include_senders')
        include_subject = feature_config.get('include_subject')
        include_thread_ids = feature_config.get('include_thread_ids')
        feature_model = feature_config.get('model')

        print(f"Extracting features...")

        use_tfidf = feature_model != "Autoencoder" and feature_model != "BERT"
        encode_thread_ids = feature_model == "Autoencoder" or model == "K-means"

        body_df = get_body_df(df, use_tfidf) if include_bodies else pd.DataFrame()
        dates_df = extract_date(df['date']) if include_dates else pd.DataFrame()
        subject_df = get_subject_df(df, use_tfidf) if include_subject else pd.DataFrame()
        labels_df = encode_column(df['labelIds']) if include_labels else pd.DataFrame()
        senders_df = extract_senders(df['from']) if include_senders else pd.DataFrame()
        thread_ids_df = extract_thread_ids(df['threadId'], encode_thread_ids) if include_thread_ids else pd.DataFrame()

        final_df = pd.DataFrame()
        other_dfs = [body_df, dates_df, subject_df, labels_df, senders_df, thread_ids_df]
        for other_df in other_dfs:
            if not other_df.empty:
                final_df = pd.concat([final_df, other_df], axis=1)

        print(f"Feature extraction complete. Final shape: {final_df.shape}.")
        return final_df
    except Exception as e:
        print(f"Error extracting features: {e}")
        return pd.DataFrame()