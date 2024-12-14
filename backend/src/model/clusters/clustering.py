import pandas as pd
from sklearn.preprocessing import StandardScaler
from .hdbscan import run_hdbscan
from .kmeans import run_kmeans
from ..features.feature_extraction import extract_features, process_features
from ..features.pca import run_pca
from ..labels.label_generator import label_clusters
from ...utils.custom_print import CustomPrint
from ...utils.preprocess import clean_and_lemmatize, count_top_keywords, extract_keywords, get_stopwords
from ...utils.scoring import calculate_silhouette_score

printer = CustomPrint()

def init_df(emails_df, feature_config, stopwords):
    df = emails_df.copy()
    df['parent_id'] = None

    include_bodies = feature_config.get('include_bodies')
    include_subjects = feature_config.get('include_subjects')
    include_capitals = feature_config.get('include_capitals')
    min_email_length = feature_config.get('min_email_length')

    invalid_emails = pd.DataFrame()
    if min_email_length:
        invalid_emails = df[df['body'].str.len() < min_email_length]
        invalid_emails['cluster_id'] = -2
        df = df[df['body'].str.len() >= min_email_length]

    # If include_capitals is enabled, it'll extract capitals from BOTH body and subject
    if include_bodies or include_capitals:
        printer.status("Cleaning bodies...")
        df['raw_body'] = df['body']
        cleaned_body = df['body'].apply(lambda text: clean_and_lemmatize(text, stopwords))
        if include_bodies:
            df['body'] = cleaned_body.apply(lambda text: text.lower())
        if include_capitals:
            df['body_with_casing'] = cleaned_body
        printer.success("Cleaning complete.")

    if include_subjects or include_capitals:
        printer.status("Cleaning subjects...")
        df['raw_subject'] = df['subject']
        cleaned_subject = df['subject'].apply(lambda text: clean_and_lemmatize(text, stopwords))
        if include_subjects:
            df['subject'] = cleaned_subject.apply(lambda text: text.lower())
        if include_capitals:
            df['subject_with_casing'] = cleaned_subject
        printer.success("Cleaning complete.")

    return df, invalid_emails

def run_model(emails_df, categories, feature_config, model_config, naming_config, custom_stopwords):
    printer.status(f"Setting up model with config {model_config} and {len(emails_df)} emails...")

    # Set-up
    stopwords = get_stopwords(custom_stopwords)
    df, invalid_emails = init_df(emails_df, feature_config, stopwords)
    
    # Feature extraction and processing
    body_df, features_df = extract_features(df, feature_config)
    features = process_features(body_df, features_df, feature_config)

    # Scale
    features = StandardScaler().fit_transform(features)

    # Clustering
    model = model_config.get('model')
    centroids = None
    elbow_data = {}

    if model == "K-means" or model == "Layered K-means":
        num_clusters = model_config.get('num_clusters')
        df, features, centroids = run_kmeans(df, features, model, num_clusters)
    elif model == "HDBSCAN":
        min_cluster_size = model_config.get('min_cluster_size')
        min_samples = model_config.get('min_samples')
        df = run_hdbscan(df, features, min_cluster_size, min_samples)
    else:
        raise ValueError(f"Invalid model: {model}")

    # Scoring
    score = calculate_silhouette_score(features, df['cluster_id'])

    # PCA for centroid (K-means only) and cluster visualization
    centroids_data = run_pca(df, centroids, features)

    # Keyword extraction
    cluster_keywords = extract_keywords(df, stopwords)
    cluster_top_keywords = count_top_keywords(df, stopwords, top_n=naming_config.get('num_keywords', 10))

    # Labeling
    clusters_with_labels = label_clusters(df, cluster_keywords, cluster_top_keywords, categories, naming_config)

    printer.success("Model execution complete.")
    return df, clusters_with_labels, score, centroids_data, elbow_data, cluster_top_keywords, invalid_emails