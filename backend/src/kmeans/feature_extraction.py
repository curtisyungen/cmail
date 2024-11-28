from collections import Counter
from datetime import datetime
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

def compute_sender_freqs(sender_column):
    sender_counts = Counter(sender_column)
    total_senders = len(sender_column)
    return { sender: count / total_senders for sender, count in sender_counts.items() }

def process_subject(subject):
    return subject.lower().strip()

def process_time(timestamp):
    if isinstance(timestamp, pd.Timestamp):
        date_time = timestamp
    else:
        date_time = datetime.fromtimestamp(timestamp / 1000) if timestamp else None
    
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
    
def run_tfidf(df):
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000, ngram_range=(1, 4))
    tfidf_matrix = vectorizer.fit_transform(df['body'])
    tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), columns=vectorizer.get_feature_names_out())
    return tfidf_df

def extract_features(email_entry, sender_freqs):
    sender = email_entry.get("from_email", "")
    timestamp = email_entry.get("date", None)
    subject = email_entry.get("subject", "")

    features = {}
    features["sender_freq"] = sender_freqs.get(sender, 0)
    features.update(process_time(timestamp))
    subject = process_subject(subject)

    return features

def extract_features_from_dataframe(df):
    sender_freqs = compute_sender_freqs(df['from_email'])

    extracted_features = []
    total_rows = len(df)
    
    for idx, row in df.iterrows():
        if idx % 100 == 0 and idx > 0:
            print(f"Processed {idx}/{total_rows} rows")
        features = extract_features(row, sender_freqs)
        extracted_features.append(features)
    print(f"Processing complete.")

    tfidf_df = run_tfidf(df)
    features_df = pd.DataFrame(extracted_features).fillna(0)
    final_df = pd.concat([tfidf_df, features_df], axis=1)

    return final_df