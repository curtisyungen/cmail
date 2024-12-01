from collections import Counter
from datetime import datetime
import emoji
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer

def clean_subject(subject):
    return emoji.replace_emoji(subject, replace='').lower().strip()

def compute_sender_freqs(sender_column):
    try:
        sender_column = sender_column.fillna("").astype(str)

        email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        cleaned_senders = sender_column.apply(lambda x: re.sub(r'\s+|<.*?>', '', x).strip())
        valid_senders = cleaned_senders[cleaned_senders.apply(lambda x: re.match(email_pattern, x) is not None)]

        sender_counts = Counter(valid_senders)
        sender_counts = {k: int(v) for k, v in sender_counts.items()}
        total_senders = len(valid_senders)

        if total_senders == 0:
            return {}
        
        sender_freqs = {}
        for sender, count in sender_counts.items():
            freq = count / total_senders
            sender_freqs[sender] = freq
        return sender_freqs
    except Exception as e:
        print(f"Error computing sender frequencies: {e}")
        return {}
    
def encode_labels(df):
    try:
        all_labels = set()
        for labels in df['labelIds']:
            all_labels.update(labels)
        label_to_index = {label: idx for idx, label in enumerate(sorted(all_labels))}
        encoded_labels = []
        for labels in df['labelIds']:
            vector = [0] * len(label_to_index)
            for label in labels:
                if label in label_to_index:
                    vector[label_to_index[label]] = 1
            encoded_labels.append(vector)
        return pd.DataFrame(encoded_labels, columns=list(label_to_index.keys()))
    except Exception as e:
        print(f"Error encoding labels: {e}")
        return None

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
    
def run_tfidf(df):
    if df['body'].isnull().any():
        print("Warning: Found null values in 'body' column")
        df = df.dropna(subset=['body'])
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000, ngram_range=(1, 3))
    tfidf_matrix = vectorizer.fit_transform(df['body'])
    tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), columns=vectorizer.get_feature_names_out())
    return tfidf_df

def extract_features(email_entry, sender_freqs, include_senders, include_subject):
    features = {}
    if include_senders:
        sender = email_entry.get("from", "")
        features["sender_freq"] = sender_freqs.get(sender, 0)
    if include_subject:
        subject = email_entry.get("subject", "")
        features["subject"] = clean_subject(subject)
    return features

def extract_features_from_dataframe(df, include_labels, include_senders, include_subject):
    try:
        print("Extract features...")
        total_rows = len(df)
        extracted_features = []
        
        labels_df = pd.DataFrame()
        if include_labels:
            labels_df = encode_labels(df)

        sender_freqs = compute_sender_freqs(df['from'])
        
        for idx, row in df.iterrows():
            if idx % 100 == 0 and idx > 0:
                print(f"Processed {idx}/{total_rows} rows")
            features = extract_features(row, sender_freqs, include_senders, include_subject)
            extracted_features.append(features)

        tfidf_df = run_tfidf(df)
        features_df = pd.DataFrame(extracted_features).fillna(0)
        if not labels_df is None and not labels_df.empty:
            final_df = pd.concat([tfidf_df, features_df, labels_df], axis=1)
        else:
            final_df = pd.concat([tfidf_df, features_df], axis=1)

        print(f"Feature extraction complete.")
        return final_df
    except Exception as e:
        print(f"Error extracting features: {e}")