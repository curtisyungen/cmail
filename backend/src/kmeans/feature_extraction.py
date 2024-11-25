from collections import Counter
from datetime import datetime
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer

def bigrams(text):
    words = text.split()
    if len(words) < 2:
        return {}
    return [(words[i], words[i+1]) for i in range(len(words) - 1)]

def extract_recipients(email_entry):
    return email_entry.get("to", [])

def extract_sender(email_entry):
    return email_entry.get("from_email", "")

def process_subject(subject):
    return subject.lower().strip()

def process_time(timestamp):
    if isinstance(timestamp, pd.Timestamp):
        date_time = timestamp
    else:
        date_time = datetime.fromtimestamp(timestamp / 1000) if timestamp else None
    
    if date_time:
        return {
            "hour": date_time.hour,
            "day": date_time.day,
            "weekday": date_time.weekday()
        }
    else:
        return {
            "hour": None,
            "day": None,
            "weekday": None
        }
    
def run_tfidf(df):
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000, ngram_range=(1, 4))
    tfidf_matrix = vectorizer.fit_transform(df['body'])
    tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), columns=vectorizer.get_feature_names_out())
    return tfidf_df

def trigrams(text):
    words = text.split()
    if len(words) < 3:
        return {}
    trigrams_list = [(words[i], words[i+1], words[i+2]) for i in range(len(words) - 2)]
    trigram_counts = Counter(trigrams_list)
    return {f"trigram_{'_'.join(trigram)}": count for trigram, count in trigram_counts.items()}

def word_frequency(text):
    words = re.findall(r'\b\w+\b', text.lower())
    freq_dict = {}
    for word in words:
        freq_dict[word] = freq_dict.get(word, 0) + 1
    return freq_dict

def extract_features(email_entry, recipient_to_id, sender_to_id, subject_to_id):
    body = email_entry.get("body", "")
    subject = email_entry.get("subject", "")
    # timestamp = email_entry.get("date", None)

    features = {}
    #features.update(bigrams(body))
    # features["date"] = timestamp
    #features.update(trigrams(body))
    features.update(word_frequency(body))

    subject = process_subject(subject)
    if subject not in subject_to_id:
        subject_to_id[subject] = len(subject_to_id)
    features["subject"] = subject_to_id[subject]
    # recipients = extract_recipients(email_entry)
    # for recipient in recipients:
    #     if recipient not in recipient_to_id:
    #         recipient_to_id[recipient] = len(recipient_to_id)
    #     features.update({f"recipient_{recipient}": recipient_to_id[recipient]})
    
    sender = extract_sender(email_entry)
    if sender not in sender_to_id:
        sender_to_id[sender] = len(sender_to_id)
    features["sender"] = sender_to_id[sender]

    return features

def extract_features_from_dataframe(df, recipient_to_id, sender_to_id, subject_to_id):
    tfidf_df = run_tfidf(df)
        
    extracted_features = []
    total_rows = len(df)

    print(f"Found {total_rows} rows")
    for idx, row in df.iterrows():
        if idx % 100 == 0 and idx > 0:
            print(f"Processed {idx}/{total_rows} rows")
        features = extract_features(row, recipient_to_id, sender_to_id, subject_to_id)
        extracted_features.append(features)
    print(f"Processing complete.")

    features_df = pd.DataFrame(extracted_features)
    features_df = features_df.fillna(0)

    final_df = pd.concat([tfidf_df, features_df], axis=1)

    return final_df