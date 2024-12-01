import numpy as np

def euclidean_distance(a, b):
    return np.sqrt(np.sum((a - b) ** 2))

def calculate_silhouette_score(X, labels):
    num_samples = len(X)
    scores = []

    for i in range(num_samples):
        point = X[i]
        point_label = labels[i]

        same_cluster_points = X[labels == point_label]
        a_i = np.mean([euclidean_distance(point, other_point) for other_point in same_cluster_points if not np.array_equal(point, other_point)])

        unique_labels = np.unique(labels)
        unique_labels = unique_labels[unique_labels != point_label]

        b_i = float('inf')
        for label in unique_labels:
            other_cluster_points = X[labels == label]
            b_i_for_cluster = np.mean([euclidean_distance(point, other_point) for other_point in other_cluster_points])
            b_i = min(b_i, b_i_for_cluster)

        s_i = (b_i - a_i) / max(a_i, b_i) if max(a_i, b_i) != 0 else 0
        scores.append(s_i)

    return np.mean(scores)