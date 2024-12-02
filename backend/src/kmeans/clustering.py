import hdbscan
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from .kmeans import KMeans
from .silhouette_score import calculate_silhouette_score
from .lda_topic_generator import run_lda
from .feature_extraction import extract_features_from_dataframe
from ..neural.autoencoder import construct_autoencoder
from ..neural.bert import initialize_bert, get_bert_embeddings
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

def run_autoencoder(features, feature_config):
    try:
        print("Running autoencoder...")
        encoding_dim = feature_config.get('encoding_dim', 256)
        epochs = feature_config.get('epochs', 50)
        autoencoder, encoder = construct_autoencoder(features.shape[1], encoding_dim)
        autoencoder.fit(features, features, epochs=epochs, batch_size=32, shuffle=True, verbose=1)
        embeddings = encoder.predict(features)
        print("Autoencoder complete.")
        return embeddings
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
        return df
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

def run_pca(df, features):
    try:
        print("Running PCA...")
        pca = PCA(n_components=2)
        features_2d = pca.fit_transform(features)
        df['x'] = features_2d[:, 0]
        df['y'] = features_2d[:, 1]
        print("PCA complete.")
        return df
    except Exception as e:
        print(f"Error running PCA: {e}")
        return df
    
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
            return cluster_keywords
        print("Keyword extraction complete.")
    except Exception as e:
        print(f"Error extracting keywords: {e}")
        return None
    
def label_clusters(df, cluster_keywords, categories, lda_config):
    try:
        print(f"Labeling clusters...")
        clusters_with_labels = []
        for cluster in df['cluster_id'].unique():
            keywords = cluster_keywords[int(cluster)]
            lda_result = run_lda(cluster, keywords, categories, 
                                no_below=lda_config.get('no_below'), 
                                no_above=lda_config.get('no_above'), 
                                num_topics=lda_config.get('num_topics'))
            clusters_with_labels.append(lda_result)
        print("Labeling complete.")
    except Exception as e:
        print(f"Error labeling clusters: {e}")
        return None


def run_model(emails_df, categories, feature_config, lda_config, model_config):
    print(f"Setting up model with config {model_config} and {len(emails_df)} emails...")

    model = model_config.get('model')

    include_labels = model_config.get('include_labels')
    include_senders = model_config.get('include_senders')
    include_subject = model_config.get('include_subject')
    feature_model = feature_config.get('model')
    use_tfidf = feature_model == "None"
    
    # DataFrame set-up
    df = init_df(emails_df, include_subject)
    features_df = extract_features_from_dataframe(df, include_labels, include_senders, include_subject, use_tfidf=use_tfidf)
    X = np.array(features_df.values, dtype=float)

    # Feature extraction
    features = X
    if feature_model == "Autoencoder":
        features = run_autoencoder(features, feature_config)
    elif feature_model == "BERT":
        features = run_bert(df['body'].tolist())
    features = StandardScaler().fit_transform(features)

    # Clustering
    if model == "K-means":
        num_clusters = model_config.get('num_clusters')
        df = run_kmeans(df, features, num_clusters)
    elif model == "HDBSCAN":
        df = run_hdbscan(df)
    else:
        raise ValueError(f"Invalid model: {model}")

    # Scoring
    if model == "K-means":
        score = calculate_silhouette_score(features, df['cluster_id'])
    elif model == "HDBSCAN":
        score = 0
    else:
        score = 0

    # PCA for cluster visualization
    run_pca(df)

    # Keyword extraction
    cluster_keywords = extract_keywords(df)

    # LDA to label clusters
    clusters_with_labels = run_lda(df, cluster_keywords, categories, lda_config)

    return df, clusters_with_labels, score