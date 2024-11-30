import numpy as np
from .lda_topic_generator import run_lda
from .feature_extraction import extract_features_from_dataframe
from ..utils.preprocess import clean_and_tokenize, clean_body, lemmatize_body

class KMeans:
    def __init__(self, k, max_iterations=100, tolerance=1e-4, random_state=26):
        self.k = k
        self.max_iterations = max_iterations
        self.tolerance = tolerance
        self.random_state = random_state
        self.centroids = None

    def initialize_centroids(self, X):
        np.random.seed(self.random_state)
        initial_centroids_indices = np.random.choice(X.shape[0], self.k, replace=False)
        self.centroids = X[initial_centroids_indices]

    def assign_clusters(self, X):
        distances = np.linalg.norm(X[:, np.newaxis] - self.centroids, axis=2)
        return np.argmin(distances, axis=1)
    
    def update_centroids(self, X, labels):
        centroids = []
        for i in range(self.k):
            cluster_points = X[labels == i]
            if len(cluster_points) == 0:
                new_centroid = X[np.random.choice(len(X))]
                centroids.append(new_centroid)
            else:
                centroids.append(cluster_points.mean(axis=0))
        return np.array(centroids)
        
    def fit(self, X):
        self.initialize_centroids(X)

        for _ in range(self.max_iterations):
            labels = self.assign_clusters(X)
            new_centroids = self.update_centroids(X, labels)
            if np.linalg.norm(new_centroids - self.centroids) < self.tolerance:
                break
            self.centroids = new_centroids

        self.labels = labels
        return self
    
    def predict(self, X):
        return self.assign_clusters(X)

def run_kmeans(emails_df, num_clusters, categories, lda_config):
    df = emails_df.copy()
    df = clean_body(df)
    df = lemmatize_body(df)

    features_df = extract_features_from_dataframe(df)
    X = np.array(features_df.values, dtype=float)

    print("Running K-means...")
    kmeans = KMeans(k = num_clusters, random_state=26)
    kmeans.fit(X)
    df['cluster_id'] = kmeans.labels
    print("K-means complete.")

    print("Extracting keywords...")
    cluster_words = {}
    for cluster in df['cluster_id'].unique():
        cluster_emails = df[df['cluster_id'] == cluster]['body']
        all_words = []
        for email in cluster_emails:
            all_words.extend(clean_and_tokenize(email))
        cluster_words[int(cluster)] = all_words
    print("Extraction complete.")

    print(f"Running LDA...")
    print(f"Categories: {categories}")
    clusters_with_labels = []
    for cluster in df['cluster_id'].unique():
        keywords = cluster_words[int(cluster)]
        lda_result = run_lda(cluster, keywords, categories, 
                             no_below=lda_config.get('no_below'), 
                             no_above=lda_config.get('no_above'), 
                             num_topics=lda_config.get('num_topics'))
        clusters_with_labels.append(lda_result)
    print("LDA complete.")

    return df, clusters_with_labels