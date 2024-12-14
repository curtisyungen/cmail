import numpy as np
import pandas as pd
from ...utils.custom_print import CustomPrint
from ...utils.scoring import calculate_cluster_inertia, calculate_silhouette_score

printer = CustomPrint()

class KMeans:
    def __init__(self, k, max_iterations=100, tolerance=1e-4, random_state=26):
        self.k = k
        self.max_iterations = max_iterations
        self.tolerance = tolerance
        self.random_state = random_state
        self.centroids = None
        self.labels = None
        self.inertia = None # For Elbow Method

    def initialize_centroids(self, X):
        try:
            np.random.seed(self.random_state)
            centroids = [X[np.random.choice(X.shape[0])]]
            for _ in range(1, self.k):
                distances = np.min(np.linalg.norm(X[:, np.newaxis] - np.array(centroids), axis=2), axis=1)
                prob_distances = distances ** 2
                if prob_distances.sum() == 0:
                    printer.info("All distances are zero. Choosing random centroid.")
                    prob_distances = np.ones_like(prob_distances)
                prob_distances /= (prob_distances.sum() + 1e-10)
                prob_distances /= prob_distances.sum()
                next_centroid = X[np.random.choice(X.shape[0], p=prob_distances)]
                centroids.append(next_centroid)
            self.centroids = np.array(centroids)
        except Exception as e:
            printer.error(f"Error initializing centroids: {e}")

    def assign_clusters(self, X):
        try:
            distances = np.linalg.norm(X[:, np.newaxis] - self.centroids, axis=2)
            return np.argmin(distances, axis=1)
        except Exception as e:
            printer.error(f"Error assigning clusters: {e}")
    
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
            printer.error(f"Error updating centroids: {e}")

    def calculate_inertia(self, X, labels):
        try:
            inertia = 0.0
            for i in range(self.k):
                cluster_points = X[labels == i]
                distances = np.linalg.norm(cluster_points - self.centroids[i], axis=1) ** 2
                inertia += distances.sum()
            return inertia
        except Exception as e:
            printer.error(f"Error calculating inertia: {e}")
            return None
        
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
            self.inertia = self.calculate_inertia(X, labels)
            return self
        except Exception as e:
            printer.error(f"Error fitting: {e}")

def find_max_silhouette_score(features, max_clusters):
    printer.status(f"Finding max. silhouette score with max of {max_clusters} clusters...")
    try:
        silhouette_scores = []
        for k in range(2, max_clusters + 1):
            kmeans = KMeans(k=k, random_state=26)
            kmeans.fit(features)
            silhouette_score = calculate_silhouette_score(features, kmeans.labels)
            silhouette_scores.append(silhouette_score)
            printer.info(f"Silhouette score with {k} clusters = {silhouette_score:.2f}")
        optimal_clusters = np.argmax(silhouette_scores) + 2
        printer.info(f"Max. silhouette score found with optimal clusters: {optimal_clusters} clusters")
        return optimal_clusters
    except Exception as e:
        printer.error(f"Error finding max. silhouette score: {e}")
        return None, None

def run_kmeans_model(features, num_clusters):
    try:
        printer.status("Running K-means model...")
        if not num_clusters: # User has selected 'Optimal' OR second layer of Layered K-means
            num_clusters = find_max_silhouette_score(features, max_clusters=20)
        kmeans = KMeans(k=int(num_clusters), random_state=26)
        kmeans.fit(features)
        printer.success("K-means model complete.")
        return kmeans
    except Exception as e:
        printer.error(f"Error running k-means model: {e}")
        return None

def run_layered_kmeans(df, features, num_clusters):
    try:
        printer.status("Running layered K-means...")
        kmeans = run_kmeans_model(features, num_clusters)

        df['cluster_id'] = kmeans.labels
        centroids = kmeans.centroids

        inertia_threshold = 1000
        unique_cluster_ids = df['cluster_id'].unique()

        for cluster_id in unique_cluster_ids:
            cluster_size = len(df[df['cluster_id'] == cluster_id])
            cluster_indices = df[df['cluster_id'] == cluster_id].index
            cluster_features = features[cluster_indices]
            cluster_inertia = calculate_cluster_inertia(cluster_features, centroids[cluster_id])

            if cluster_inertia >= inertia_threshold and cluster_size >= 30:
                printer.info(f"Re-running K-means for cluster {cluster_id}...")
                sub_kmeans = run_kmeans_model(cluster_features, None)

                if sub_kmeans:
                    sub_df = df.loc[cluster_indices].copy()
                    sub_df['parent_id'] = int(cluster_id)
                    sub_df['cluster_id'] = (int(cluster_id) + 1) * 10 + sub_kmeans.labels
                    df = pd.concat([df, sub_df], axis=0)
                    features = np.vstack([features, cluster_features])
                    centroids = np.vstack([kmeans.centroids, sub_kmeans.centroids])
                    
        return df, features, centroids
    except Exception as e:
        printer.error(f"Error running layered K-means: {e}")
        return df, features, centroids
        
def run_single_kmeans(df, features, num_clusters):
    try:
        printer.status("Running single K-means...")
        kmeans = run_kmeans_model(features, num_clusters)
        df['cluster_id'] = kmeans.labels
        centroids = kmeans.centroids
        return df, centroids
    except Exception as e:
        printer.error(f"Error running single K-means: {e}")
        return df, None
    
def run_kmeans(df, features, model, num_clusters):
    if model == "K-means":
        df, features, centroids = run_single_kmeans(df, features, num_clusters)
    elif model == "Layered K-means":
        df, features, centroids = run_layered_kmeans(df, features, num_clusters)
    return df, features, centroids