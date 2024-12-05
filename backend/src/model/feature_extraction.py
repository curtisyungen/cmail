from collections import Counter
import numpy as np
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from .autoencoder import construct_autoencoder
from .bert import initialize_bert, get_bert_embeddings

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
        cleaned_datetime = datetime_column.apply(lambda x: re.sub(r"^\w{3},\s*|\s\([A-Za-z]+\)$", "", x))
        datetime_column = pd.to_datetime(cleaned_datetime, format='%d %b %Y %H:%M:%S %z', utc=True)
        timestamps = (datetime_column.astype(np.int64) // 10**9)
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
    
def extract_labels(labels_column):
    try:
        flattened_labels = [label for label_list in labels_column for label in label_list]
        all_labels = set(flattened_labels)
        label_id_to_index = {label: idx for idx, label in enumerate(sorted(all_labels))}
        encoded_labels = []
        for label_list in labels_column:
            vector = [0] * len(label_id_to_index)
            for label in label_list:
                if label in label_id_to_index:
                    vector[label_id_to_index[label]] = 1
            encoded_labels.append(vector)
        return pd.DataFrame(encoded_labels, columns=sorted(label_id_to_index.keys()))
    except Exception as e:
        print(f"Error extracting labels: {e}")
        return pd.DataFrame()

def extract_senders(sender_column):
    try:
        sender_freqs = compute_sender_freqs(sender_column)
        sender_df = sender_column.apply(lambda sender: sender_freqs.get(sender, 0)).to_frame(name='sender_freq')
        return sender_df
    except Exception as e:
        print(f"Error extracting senders: {e}")
        return pd.DataFrame()
    
def extract_thread_ids(thread_id_column):
    try:
        thread_id_to_index = {thread_id: idx for idx, thread_id in enumerate(sorted(set(thread_id_column)))}
        encoded_thread_ids = [int(thread_id_to_index[thread_id]) for thread_id in thread_id_column]
        return pd.DataFrame(encoded_thread_ids, columns=["encoded_threadId"])
    except Exception as e:
        print(f"Error extracting thread IDs: {e}")
        return pd.DataFrame()

def run_autoencoder(features, feature_config):
    try:
        print(f"Running autoencoder...")
        encoding_dim = feature_config.get('encoding_dim', 256)
        epochs = feature_config.get('epochs', 50)
        autoencoder, encoder = construct_autoencoder(features.shape[1], encoding_dim)
        autoencoder.fit(features, features, epochs=epochs, batch_size=32, shuffle=True, verbose=1)
        embeddings = encoder.predict(features)
        print("Autoencoder complete.")
        return embeddings.tolist()
    except Exception as e:
        print(f"Error running autoencoder: {e}")
        return None
    
def run_bert(features):
    try:
        print("Running BERT...")
        tokenizer, feature_model = initialize_bert(model_name='bert-base-uncased')
        embeddings = get_bert_embeddings(features, tokenizer, feature_model, pooling='mean', max_length=128)
        print("BERT complete.")
        return embeddings
    except Exception as e:
        print(f"Error running BERT: {e}")
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

def extract_features(df, feature_config):
    try:
        print(f"feature_config: {feature_config}")
        feature_model = feature_config.get('model')

        include_bodies = feature_config.get('include_bodies')
        include_subject = feature_config.get('include_subject')
        include_dates = feature_config.get('include_dates')
        include_labels = feature_config.get('include_labels')
        include_senders = feature_config.get('include_senders')
        include_thread_ids = feature_config.get('include_thread_ids')

        print(f"Extracting features...")
        body_df = pd.DataFrame()
        if include_bodies:
            if feature_model == "Autoencoder":
                body_df = encode_column(df['body'])
            elif feature_model == "BERT":
                body_df = pd.DataFrame(df['body'])
            else:
                body_df = run_tfidf(df, 'body')

        subject_df = pd.DataFrame()
        if include_subject:
            if feature_model == "Autoencoder":
                subject_df = encode_column(df['subject'])
            else:
                subject_df = run_tfidf(df, 'subject')

        dates_df = extract_date(df['date']) if include_dates else pd.DataFrame()
        labels_df = extract_labels(df['labelIds']) if include_labels else pd.DataFrame()
        senders_df = extract_senders(df['from']) if include_senders else pd.DataFrame()
        thread_ids_df = extract_thread_ids(df['threadId']) if include_thread_ids else pd.DataFrame()

        features_df = pd.DataFrame()
        other_dfs = [subject_df, dates_df, labels_df, senders_df, thread_ids_df]

        for df in other_dfs:
            if not df.empty:
                features_df = pd.concat([features_df, df], axis=1)

        print(f"Feature extraction complete. Body_df shape: {body_df.shape}, features_df shape: {features_df.shape}.")
        return body_df, features_df
    except Exception as e:
        print(f"Error extracting features: {e}")
        return pd.DataFrame(), pd.DataFrame()
    
def process_features(body_df, features_df, feature_config):
    try:
        if body_df.empty and features_df.empty:
            raise ValueError(f"No features found. Check configuration.")
        
        feature_model = feature_config.get('model')
        
        if feature_model == "BERT":
            if body_df.empty:
                print("Skipping BERT because body_df is empty.")
                features = features_df.values
            else:
                # Operates on body only; don't pass in categorical features like thread IDs, dates, etc.
                bert_features = run_bert(body_df['body'].tolist())
                if len(bert_features) == 0:
                    features = features_df.values
                elif features_df.empty:
                    features = bert_features
                else:
                    features = np.hstack([bert_features, features_df.values])
        else:
            if body_df.empty:
                features = features_df.values
            elif features_df.empty:
                features = body_df.values
            else:
                features = np.hstack([body_df.values, features_df.values])

            if feature_model == "Autoencoder":
                features = run_autoencoder(features, feature_config)

        print(f"Feature processing complete. Features size: {len(features)}")
        return np.array(features, dtype=float)
    except Exception as e:
        print(f"Error processing features: {e}")
        return None