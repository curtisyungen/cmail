import hdbscan
import pandas as pd
from collections import Counter
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from .kmeans import KMeans
from .cluster_labeler import label_clusters
from .elbow_method import run_elbow_method
from .silhouette_score import calculate_silhouette_score
from .feature_extraction import extract_features, process_features
from ..utils.preprocess import clean_and_tokenize, clean_and_lemmatize, get_stopwords

def init_df(emails_df, custom_stopwords, include_bodies, include_subjects, include_capitals):
    df = emails_df.copy()

    stopwords = get_stopwords(custom_stopwords) if include_bodies or include_subjects or include_capitals else []

    # If include_capitals is enabled, it'll extract capitals from BOTH body and subject
    if include_bodies or include_capitals:
        print("Cleaning bodies...")
        cleaned_body = df['body'].apply(lambda text: clean_and_lemmatize(text, stopwords))
        if include_bodies:
            df['body'] = cleaned_body.apply(lambda text: text.lower())
        if include_capitals:
            df['body_with_casing'] = cleaned_body
        print("Cleaning complete.")

    if include_subjects or include_capitals:
        print("Cleaning subjects...")
        cleaned_subject = df['subject'].apply(lambda text: clean_and_lemmatize(text, stopwords))
        if include_subjects:
            df['subject'] = cleaned_subject.apply(lambda text: text.lower())
        if include_capitals:
            df['subject_with_casing'] = cleaned_subject
        print("Cleaning complete.")

    return df
    
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
        n_components = min(2, features.shape[1]) 
        pca = PCA(n_components=n_components)
        features_2d = pca.fit_transform(features)
        if features_2d.shape[1] >= 2:
            df['x'] = features_2d[:, 0]
            df['y'] = features_2d[:, 1]
        else:
            df['x'] = features_2d[:, 0]
            df['y'] = None
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

def run_model(emails_df, categories, feature_config, model_config, naming_config, stopwords):
    print(f"Setting up model with config {model_config} and {len(emails_df)} emails...")
    
    # Set-up
    df = init_df(emails_df, stopwords, feature_config.get('include_bodies'), 
                 feature_config.get('include_subjects'), feature_config.get('include_capitals'))
    
    # Feature extraction and processing
    body_df, features_df = extract_features(df, feature_config)
    features = process_features(body_df, features_df, feature_config)

    # Scale
    features = StandardScaler().fit_transform(features)

    # Clustering
    model = model_config.get('model')
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

    # Labeling
    clusters_with_labels = label_clusters(df['cluster_id'], cluster_keywords, cluster_keyword_counts, categories, naming_config)

    print("Model execution complete.")
    return df, clusters_with_labels, score, centroids_data, elbow_data, cluster_keyword_counts