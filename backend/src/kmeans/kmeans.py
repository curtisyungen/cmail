import numpy as np
from sklearn.decomposition import PCA
from .silhouette_score import calculate_silhouette_score
from .lda_topic_generator import run_lda
from .feature_extraction import extract_features_from_dataframe
from ..utils.preprocess import clean_and_tokenize, clean_text, lemmatize_body

class KMeans:
    def __init__(self, k, max_iterations=100, tolerance=1e-4, random_state=26):
        self.k = k
        self.max_iterations = max_iterations
        self.tolerance = tolerance
        self.random_state = random_state
        self.centroids = None
        self.labels = None

    def initialize_centroids(self, X):
        try:
            np.random.seed(self.random_state)
            centroids = [X[np.random.choice(X.shape[0])]]
            for _ in range(1, self.k):
                distances = np.min(np.linalg.norm(X[:, np.newaxis] - np.array(centroids), axis=2), axis=1)
                prob_distances = distances ** 2
                prob_distances /= prob_distances.sum()
                next_centroid = X[np.random.choice(X.shape[0], p=prob_distances)]
                centroids.append(next_centroid)
            self.centroids = np.array(centroids)
        except Exception as e:
            print(f"Error initializing centroids: {e}")

    def assign_clusters(self, X):
        try:
            distances = np.linalg.norm(X[:, np.newaxis] - self.centroids, axis=2)
            return np.argmin(distances, axis=1)
        except Exception as e:
            print(f"Error assigning clusters: {e}")
    
    def update_centroids(self, X, labels):
        try:
            centroids = []
            for i in range(self.k):
                cluster_points = X[labels == i]
                if len(cluster_points) == 0:
                    new_centroid = X[np.random.choice(len(X))]
                    centroids.append(new_centroid)
                else:
                    centroids.append(cluster_points.mean(axis=0))
            return np.array(centroids)
        except Exception as e:
            print(f"Error updating centroids: {e}")
        
    def fit(self, X):
        try:
            self.initialize_centroids(X)
            for _ in range(self.max_iterations):
                labels = self.assign_clusters(X)
                new_centroids = self.update_centroids(X, labels)
                if np.all(labels == self.labels) and np.linalg.norm(new_centroids - self.centroids) < self.tolerance:
                    break
                self.centroids = new_centroids
                self.labels = labels
            return self
        except Exception as e:
            print(f"Error fitting: {e}")

def run_kmeans(emails_df, categories, kmeans_config, lda_config):
    print(f"Setting up K-means with config {kmeans_config} and {len(emails_df)} emails...")
    include_labels = kmeans_config.get('include_labels')
    include_senders = kmeans_config.get('include_senders')
    include_subject = kmeans_config.get('include_subject')
    num_clusters = kmeans_config.get('num_clusters')
    
    df = emails_df.copy()
    df = clean_text(df, 'body')
    df = lemmatize_body(df)

    if include_subject:
        df = clean_text(df, 'subject')

    features_df = extract_features_from_dataframe(df, include_labels, include_senders, include_subject)
    X = np.array(features_df.values, dtype=float)

    print("Running K-means...")
    kmeans = KMeans(k = int(num_clusters), random_state=26)
    kmeans.fit(X)
    df['cluster_id'] = kmeans.labels
    print("K-means complete.")

    print("Calculating silhouette score...")
    silhouette_score = calculate_silhouette_score(X, kmeans.labels)
    print("Calculation complete.")

    print("Running PCA...")
    pca = PCA(n_components=2)
    X_2d = pca.fit_transform(X)
    df['x'] = X_2d[:, 0]
    df['y'] = X_2d[:, 1]
    print("PCA complete.")

    print("Extracting keywords...")
    cluster_emails = {}
    cluster_words = {}
    for cluster in df['cluster_id'].unique():
        emails = df[df['cluster_id'] == cluster]['body']
        all_words = []
        for email in emails:
            all_words.extend(clean_and_tokenize(email))
        cluster_words[int(cluster)] = all_words
        cluster_emails[int(cluster)] = emails
    print("Keyword extraction complete.")

    print(f"Running LDA...")
    clusters_with_labels = []
    for cluster in df['cluster_id'].unique():
        cluster_emails = df[df['cluster_id'] == cluster]['body']
        keywords = cluster_words[int(cluster)]
        lda_result = run_lda(cluster, keywords, categories, 
                             no_below=lda_config.get('no_below'), 
                             no_above=lda_config.get('no_above'), 
                             num_topics=lda_config.get('num_topics'))
        clusters_with_labels.append(lda_result)
    print("LDA complete.")

    return df, clusters_with_labels, silhouette_score