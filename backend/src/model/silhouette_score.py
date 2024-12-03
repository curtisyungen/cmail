import numpy as np

def euclidean_distance(a, b):
    return np.sqrt(np.sum((a - b) ** 2))

def calculate_silhouette_score(X, labels):
    print("Calculating silhouette score...")
    try:
        unique_labels = np.unique(labels)
        if len(unique_labels) == 1:
            return 0
        
        num_samples = len(X)
        scores = []

        for i in range(num_samples):
            point = X[i]
            point_label = labels[i]

            # This can happen when using HDBSCAN due to 'noisy' data points
            if point_label == -1:
                continue

            same_cluster_points = X[labels == point_label]
            if len(same_cluster_points) <= 1:
                a_i = 0
            else:
                a_i = np.mean([
                    euclidean_distance(point, other_point) 
                    for other_point in same_cluster_points 
                    if not np.array_equal(point, other_point)
                ])

            b_i = float('inf')
            for label in unique_labels:
                if label == point_label or label == -1:
                    continue
                other_cluster_points = X[labels == label]
                if len(other_cluster_points) == 0:
                    continue
                b_i_for_cluster = np.mean([
                    euclidean_distance(point, other_point) 
                    for other_point in other_cluster_points
                ])
                b_i = min(b_i, b_i_for_cluster)

            s_i = (b_i - a_i) / max(a_i, b_i) if max(a_i, b_i) != 0 else 0
            scores.append(s_i)

        silhouette_score = np.nanmean(scores) if scores else 0
        print(f"Silhouette score: {silhouette_score}")
        return silhouette_score
    except Exception as e:
        print(f"Error calculating silhouette score: {e}")
        return None