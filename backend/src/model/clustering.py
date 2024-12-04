import hdbscan
import numpy as np
import pandas as pd
from collections import Counter
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from .kmeans import KMeans
from .elbow_method import run_elbow_method
from .silhouette_score import calculate_silhouette_score
from .lda_topic_generator import run_lda
from .feature_extraction import extract_features_from_dataframe
from .autoencoder import construct_autoencoder
from .bert import initialize_bert, get_bert_embeddings
from ..utils.preprocess import clean_and_tokenize, clean_text, lemmatize_text

def init_df(emails_df, include_subject):
    df = emails_df.copy()

    df['raw_body'] = df['body']

    print("Cleaning bodies...")
    df['body'] = df['body'].apply(clean_text)
    df['body'] = df['body'].apply(lemmatize_text)
    print("Cleaning complete.")

    if include_subject:
        print("Cleaning subjects...")
        df['raw_subject'] = df['subject']
        df['subject'] = df['subject'].apply(clean_text)
        df['subject'] = df['subject'].apply(lemmatize_text)
        print("Cleaning complete.")

    return df

def run_autoencoder(features, feature_config):
    try:
        print(f"Running autoencoder...")
        encoding_dim = feature_config.get('encoding_dim', 384)
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
    
def run_kmeans(df, features, num_clusters):
    try:
        print("Running K-means...")
        kmeans = KMeans(k = int(num_clusters), random_state=26)
        kmeans.fit(features)
        df['cluster_id'] = kmeans.labels
        print("K-means complete.")
        return df, kmeans
    except Exception as e:
        print(f"Error running k-means: {e}")
        return None


def run_hdbscan(df, features):
    try:
        print("Running HDBSCAN...")
        clusterer = hdbscan.HDBSCAN(min_cluster_size=5, min_samples=5, gen_min_span_tree=True)
        clusterer.fit(features)
        df['cluster_id'] = clusterer.labels_
        print("HDBSCAN complete.")
        return df
    except Exception as e:
        print(f"Error running HDBSCAN: {e}")
        return pd.DataFrame()

def run_pca(df, centroids, features):
    try:
        print("Running PCA...")
        pca = PCA(n_components=2)
        features_2d = pca.fit_transform(features)
        df['x'] = features_2d[:, 0]
        df['y'] = features_2d[:, 1]

        centroids_data = []
        if centroids is not None and centroids.size > 0:
            centroids_2d = pca.transform(centroids)
            centroids_data = [{'x': float(c[0]), 'y': float(c[1])} for c in centroids_2d]
        print("PCA complete.")
        return centroids_data
    except Exception as e:
        print(f"Error running PCA: {e}")
        return []
    
def extract_keywords(df):
    try:
        print("Extracting keywords...")
        cluster_keywords = {}
        for cluster in df['cluster_id'].unique():
            emails = df[df['cluster_id'] == cluster]['body']
            all_words = []
            for email in emails:
                all_words.extend(clean_and_tokenize(email))
            cluster_keywords[int(cluster)] = all_words
        print("Keyword extraction complete.")
        return cluster_keywords
    except Exception as e:
        print(f"Error extracting keywords: {e}")
        return {}
    
def count_keywords(df):
    try:
        print("Counting keywords...")
        cluster_keywords = {}
        for cluster in df['cluster_id'].unique():
            emails = df[df['cluster_id'] == cluster]['body']
            all_words = []
            for email in emails:
                all_words.extend(clean_and_tokenize(email))
            word_counts = Counter(all_words)
            top_keywords = word_counts.most_common(10)
            cluster_keywords[int(cluster)] = [(word, int(count)) for word, count in top_keywords]
        print("Keyword counting complete.")
        return cluster_keywords
    except Exception as e:
        print(f"Error counting keywords: {e}")
        return {}
    
def label_clusters(cluster_column, cluster_keywords, categories, lda_config):
    try:
        print(f"Labeling clusters...")
        clusters_with_labels = []
        for cluster in cluster_column.unique():
            keywords = cluster_keywords[int(cluster)]
            lda_result = run_lda(cluster, keywords, categories, 
                                no_below=lda_config.get('no_below'), 
                                no_above=lda_config.get('no_above'), 
                                num_topics=lda_config.get('num_topics'))
            clusters_with_labels.append(lda_result)
        print("Labeling complete.")
        return clusters_with_labels
    except Exception as e:
        print(f"Error labeling clusters: {e}")
        return []

def run_model(emails_df, categories, feature_config, lda_config, model_config):
    print(f"Setting up model with config {model_config} and {len(emails_df)} emails...")

    model = model_config.get('model')

    include_dates = model_config.get('include_dates')
    include_labels = model_config.get('include_labels')
    include_senders = model_config.get('include_senders')
    include_subject = model_config.get('include_subject')
    include_thread_ids = model_config.get('include_thread_ids')
    feature_model = feature_config.get('model')
    
    # Set-up
    df = init_df(emails_df, include_subject)
    
    # Feature extraction
    features_df = extract_features_from_dataframe(df, include_dates, include_labels, include_senders, 
                                                  include_subject, include_thread_ids, 
                                                  feature_model, model)
    features = None

    if feature_model == "Autoencoder":
        features = run_autoencoder(features_df.values, feature_config)
    elif feature_model == "BERT":
        # Don't pass in categorical features like thread IDs, dates, etc.
        features = run_bert(df['body'].tolist())
    else:
        features = np.array(features_df.values, dtype=float)

    # Scale
    features = StandardScaler().fit_transform(features)

    # Clustering
    centroids = None
    elbow_data = {}
    if model == "K-means":
        num_clusters = model_config.get('num_clusters')
        if not num_clusters: # User has selected 'Optimal'
            num_clusters, elbow_data = run_elbow_method(features, max_clusters=20)
        df, kmeans = run_kmeans(df, features, num_clusters)
        centroids = kmeans.centroids
    elif model == "HDBSCAN":
        df = run_hdbscan(df, features)
    else:
        raise ValueError(f"Invalid model: {model}")

    # Scoring
    score = calculate_silhouette_score(features, df['cluster_id'])

    # PCA for centroid (K-means only) and cluster visualization
    centroids_data = run_pca(df, centroids, features)

    # Keyword extraction
    cluster_keywords = extract_keywords(df)
    cluster_keyword_counts = count_keywords(df)

    # LDA to label clusters
    clusters_with_labels = label_clusters(df['cluster_id'], cluster_keywords, categories, lda_config)

    print("Model execution complete.")
    return df, clusters_with_labels, score, centroids_data, elbow_data, cluster_keyword_counts