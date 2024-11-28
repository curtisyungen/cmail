import numpy as np
from collections import Counter
from .lda_topic_generator import run_lda
from .feature_extraction import extract_features_from_dataframe
from ..utils.preprocess import clean_and_tokenize, load_data

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
        return np.array([X[labels == i].mean(axis=0) for i in range(self.k)])
        
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

def run_kmeans(num_clusters, categories, lda_config):
    df = load_data()

    features_df = extract_features_from_dataframe(df)
    X = np.array(features_df.values, dtype=float)

    kmeans = KMeans(k = num_clusters, random_state=26)
    kmeans.fit(X)
    df['cluster_label'] = kmeans.labels

    cluster_keywords = {}
    for cluster in df['cluster_label'].unique():
        cluster_emails = df[df['cluster_label'] == cluster]['body']
        all_words = []
        for email in cluster_emails:
            all_words.extend(clean_and_tokenize(email))

        most_common_words = Counter(all_words).most_common(10)
        cluster_keywords[int(cluster)] = most_common_words

    clusters_with_labels = []
    for cluster in df['cluster_label'].unique():
        keywords = [word for word, _ in cluster_keywords[int(cluster)]]
        lda_result = run_lda(cluster, keywords, categories, no_below=lda_config.no_below, 
                             no_above=lda_config.no_above, num_topics=1)
        clusters_with_labels.append(lda_result)

    return df, clusters_with_labels