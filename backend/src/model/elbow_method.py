import numpy as np
from .kmeans import KMeans
from .silhouette_score import calculate_silhouette_score

def run_elbow_method(features, max_clusters):
    print(f"Running Elbow Method with max of {max_clusters} clusters...")
    try:
        inertias = []
        silhouette_scores = []

        for k in range(2, max_clusters + 1):
            kmeans = KMeans(k = int(k), random_state=26)
            kmeans.fit(features)
            inertias.append(kmeans.inertia)
            if k > 1:
                silhouette_scores.append(calculate_silhouette_score(features, kmeans.labels))
            else:
                silhouette_scores.append(0)

            print(f"cluster {k}, inertia = {kmeans.inertia:.2f}, silhouette_score = {silhouette_scores[-1]:.2f}")

        inertia_diff = np.diff(inertias)
        optimal_clusters = np.argmin(inertia_diff) + 1

        elbow_data = {
            'inertias': inertias,
            'silhouette_scores': silhouette_scores
        }

        print(f"Elbow method complete with optimal clusters: {optimal_clusters} clusters")
        return optimal_clusters, elbow_data
    except Exception as e:
        print(f"Error running Elbow Method: {e}")
        return None, None