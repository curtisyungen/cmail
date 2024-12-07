from collections import Counter
import numpy as np
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from .autoencoder import construct_autoencoder
from .bert import initialize_bert, get_bert_embeddings

def compute_email_address_freqs(email_column):
    # Some recipients/senders have <email@gmail.com>; others, such as emails sent to self, are just email@gmail.com
    def extract_email_addresses(entry):
        try:
            addresses = re.split(r'[;,]', entry)
            clean_addresses = []
            for address in addresses:
                if '<' in address and '>' in address:
                    email = re.search(r'<(.*?)>', address)
                    if email:
                        clean_addresses.append(email.group(1).strip().lower())
                else:
                    clean_addresses.append(address.strip().lower())
            return clean_addresses
        except Exception as e:
            print(f"Error extracting email addresses: {e}")
            return ""
    
    try:
        all_email_addresses = []
        email_column = email_column.fillna("").astype(str)
        for entry in email_column:
            all_email_addresses.extend(extract_email_addresses(entry))
        email_address_counts = Counter(all_email_addresses)
        total_email_addresses = sum(email_address_counts.values())
        if total_email_addresses == 0:
            return {}
        email_address_freqs = {address: count / total_email_addresses for address, count in email_address_counts.items()}
        return email_address_freqs
    except Exception as e:
        print(f"Error computing email address frequencies: {e}")
        return {}
    
def encode_column(column_data):
    try:
        all_words = set()
        for text in column_data:
            words = text.lower().split()
            all_words.update(words)
        word_to_index = {word: idx for idx, word in enumerate(sorted(all_words))}
        encoded_text = []
        for text in column_data:
            words = text.lower().split()
            vector = [0] * len(word_to_index)
            for word in words:
                if word in word_to_index:
                    vector[word_to_index[word]] = 1
            encoded_text.append(vector)
        return pd.DataFrame(encoded_text, columns=list(word_to_index.keys()))
    except Exception as e:
        print(f"Error encoding text: {e}")
        return pd.DataFrame()
    
def extract_capitalized_words(data_column):
    try:
        capitalized_words_list = []
        for text in data_column:
            capitalized_regex = r'\b[A-Z][a-z]*\b(?:\s+[A-Z][a-z]*)*'
            capitalized_words = re.findall(capitalized_regex, text)
            capitalized_words_list.append(capitalized_words)
        flattened_capitalized_words = [word for sublist in capitalized_words_list for word in sublist]
        all_capitalized_words = set(flattened_capitalized_words)
        word_to_index = {word: idx for idx, word in enumerate(sorted(all_capitalized_words))}
        encoded_capitalized_words = []
        for words in capitalized_words_list:
            vector = [0] * len(word_to_index)
            for word in words:
                if word in word_to_index:
                    vector[word_to_index[word]] = 1
            encoded_capitalized_words.append(vector)
        return pd.DataFrame(encoded_capitalized_words, columns=sorted(word_to_index.keys()))
    except Exception as e:
        print(f"Error extracting capitalized words: {e}")
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

def extract_email_addresses_freqs(df, column):
    try:
        email_column = df[column]
        email_address_freqs = compute_email_address_freqs(email_column)
        final_df = email_column.apply(lambda email_address: email_address_freqs.get(email_address, 0)).to_frame(name=f"{column}_freq")
        return final_df
    except Exception as e:
        print(f"Error extracting email addresses: {e}")
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
        include_subjects = feature_config.get('include_subjects')
        include_dates = feature_config.get('include_dates')
        include_labels = feature_config.get('include_labels')
        include_recipients = feature_config.get('include_recipients')
        include_senders = feature_config.get('include_senders')
        include_thread_ids = feature_config.get('include_thread_ids')
        include_capitals = feature_config.get('include_capitals')
        max_email_length = feature_config.get('max_email_length')

        print(f"Extracting features...")
        if max_email_length and include_bodies:
            print("Trimming bodies...")
            df['body'] = df['body'].apply(lambda x: x[:max_email_length] if isinstance(x, str) else x)
            print("Trimming complete.")

        body_df = pd.DataFrame()
        if include_bodies:
            if feature_model == "Autoencoder":
                body_df = encode_column(df['body'])
            elif feature_model == "BERT":
                body_df = pd.DataFrame(df['body'])
            else:
                body_df = run_tfidf(df, 'body')

        subject_df = pd.DataFrame()
        if include_subjects:
            if feature_model == "Autoencoder":
                subject_df = encode_column(df['subject'])
            else:
                subject_df = run_tfidf(df, 'subject')

        dates_df = extract_date(df['date']) if include_dates else pd.DataFrame()
        labels_df = extract_labels(df['labelIds']) if include_labels else pd.DataFrame()
        recipients_df = extract_email_addresses_freqs(df, 'to') if include_recipients else pd.DataFrame()
        senders_df = extract_email_addresses_freqs(df, 'from') if include_senders else pd.DataFrame()
        thread_ids_df = extract_thread_ids(df['threadId']) if include_thread_ids else pd.DataFrame()
       
        bodies_with_casing_df = extract_capitalized_words(df['body_with_casing']) if include_capitals else pd.DataFrame()
        subjects_with_casing_df = extract_capitalized_words(df['subject_with_casing']) if include_capitals else pd.DataFrame()

        features_df = pd.DataFrame()
        other_dfs = [subject_df, dates_df, labels_df, recipients_df, senders_df, 
                     thread_ids_df, bodies_with_casing_df, subjects_with_casing_df]

        for other_df in other_dfs:
            if not other_df.empty:
                features_df = pd.concat([features_df, other_df], axis=1)

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