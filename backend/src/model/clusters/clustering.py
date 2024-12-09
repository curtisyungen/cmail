from sklearn.preprocessing import StandardScaler
from .hdbscan import run_hdbscan
from .kmeans import run_kmeans
from ..features.feature_extraction import extract_features, process_features
from ..features.pca import run_pca
from ..labels.label_generator import label_clusters
from ...utils.preprocess import clean_and_lemmatize, count_top_keywords, extract_keywords, get_stopwords
from ...utils.silhouette_score import calculate_silhouette_score, find_max_silhouette_score

def init_df(emails_df, stopwords, include_bodies, include_subjects, include_capitals):
    df = emails_df.copy()

    # If include_capitals is enabled, it'll extract capitals from BOTH body and subject
    if include_bodies or include_capitals:
        print("Cleaning bodies...")
        df['raw_body'] = df['body']
        cleaned_body = df['body'].apply(lambda text: clean_and_lemmatize(text, stopwords))
        if include_bodies:
            df['body'] = cleaned_body.apply(lambda text: text.lower())
        if include_capitals:
            df['body_with_casing'] = cleaned_body
        print("Cleaning complete.")

    if include_subjects or include_capitals:
        print("Cleaning subjects...")
        df['raw_subject'] = df['subject']
        cleaned_subject = df['subject'].apply(lambda text: clean_and_lemmatize(text, stopwords))
        if include_subjects:
            df['subject'] = cleaned_subject.apply(lambda text: text.lower())
        if include_capitals:
            df['subject_with_casing'] = cleaned_subject
        print("Cleaning complete.")

    return df

def run_model(emails_df, categories, feature_config, model_config, naming_config, custom_stopwords):
    print(f"Setting up model with config {model_config} and {len(emails_df)} emails...")

    include_bodies = feature_config.get('include_bodies')
    include_subjects = feature_config.get('include_subjects')
    include_capitals = feature_config.get('include_capitals')

    stopwords = get_stopwords(custom_stopwords)

    # Set-up
    df = init_df(emails_df, stopwords, include_bodies, include_subjects, include_capitals)
    
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
            num_clusters = find_max_silhouette_score(features, max_clusters=20)
            # num_clusters, elbow_data = run_elbow_method(features, max_clusters=20)
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
    cluster_keywords = extract_keywords(df, stopwords)
    cluster_top_keywords = count_top_keywords(df, stopwords, top_n=naming_config.get('num_keywords', 10))

    # Labeling
    clusters_with_labels = label_clusters(df['cluster_id'], cluster_keywords, cluster_top_keywords, categories, naming_config)

    print("Model execution complete.")
    return df, clusters_with_labels, score, centroids_data, elbow_data, cluster_top_keywords