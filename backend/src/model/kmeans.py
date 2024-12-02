import numpy as np

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
