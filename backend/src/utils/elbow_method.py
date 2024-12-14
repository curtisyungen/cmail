import numpy as np
from .scoring import calculate_silhouette_score
from ..model.clusters.kmeans import KMeans

def run_elbow_method(features, max_clusters):
    print(f"Running Elbow Method with max of {max_clusters} clusters...")
    try:
        inertias = []
        silhouette_scores = []
        for k in range(2, max_clusters + 1):
            kmeans = KMeans(k=k, random_state=26)
            kmeans.fit(features)
            inertias.append(kmeans.inertia)
            silhouette_score = calculate_silhouette_score(features, kmeans.labels)
            silhouette_scores.append(silhouette_score)
            print(f"Elbow method with {k} clusters, inertia = {kmeans.inertia:.2f}, silhouette_score = {silhouette_score:.2f}")
        inertia_diff = np.diff(inertias)
        optimal_clusters = np.argmax(inertia_diff < np.min(inertia_diff)) + 2
        elbow_data = {
            'inertias': inertias,
            'silhouette_scores': silhouette_scores
        }
        print(f"Elbow method complete with optimal clusters: {optimal_clusters} clusters")
        return optimal_clusters, elbow_data
    except Exception as e:
        print(f"Error running Elbow Method: {e}")
        return None, None
    
