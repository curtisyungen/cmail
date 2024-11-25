import json
import numpy as np
import pandas as pd
from collections import Counter
from config import GMAIL_DATA, MBOX_DATA, NUM_CLUSTERS
from .preprocess import clean_data
from .feature_extraction import extract_features_from_dataframe
from ..utils import clean_and_tokenize, mbox_to_json

class KMeans:
    def __init__(self, k, max_iterations=100, tolerance=1e-4, random_state=42):
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
    
def generate_new_data():
    mbox_to_json(MBOX_DATA, GMAIL_DATA)
    
def load_data():
    data = []
    with open(GMAIL_DATA, 'r', encoding="utf-8") as file:
        data = json.load(file)
    return clean_data(pd.DataFrame(data))

def run_kmeans(generate_data):
    if generate_data == True:
        generate_new_data()
    
    df = load_data()

    recipient_to_id = {}
    sender_to_id = {}
    subject_to_id = {}

    features_df = extract_features_from_dataframe(df, recipient_to_id, sender_to_id, subject_to_id)
    X = np.array(features_df.values, dtype=float)

    kmeans = KMeans(k = NUM_CLUSTERS)
    kmeans.fit(X)
    df['cluster_label'] = kmeans.labels

    cluster_keywords = {}
    cluster_topics = {}

    for cluster in df['cluster_label'].unique():
        cluster_emails = df[df['cluster_label'] == cluster]['body']
        all_words = []
        for email in cluster_emails:
            all_words.extend(clean_and_tokenize(email))

        most_common_words = Counter(all_words).most_common(10)
        cluster_keywords[cluster] = most_common_words
        #cluster_topics[cluster] = most_common_words[0][0].capitalize()

    for cluster, _ in cluster_keywords.items():
        print(f"Cluster Keywords: {cluster_keywords[cluster]}")
        #print(f"Suggested Topic: {cluster_topics[cluster]}")
    
    return df, cluster_keywords, cluster_topics