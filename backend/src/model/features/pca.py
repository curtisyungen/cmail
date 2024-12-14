from sklearn.decomposition import PCA
from ...utils.custom_print import CustomPrint

printer = CustomPrint()

def run_pca(df, centroids, features):
    try:
        printer.status("Running PCA...")
        n_components = min(2, features.shape[1]) 
        pca = PCA(n_components=n_components)
        features_2d = pca.fit_transform(features)
        if features_2d.shape[1] >= 2:
            df['x'] = features_2d[:, 0]
            df['y'] = features_2d[:, 1]
        else:
            df['x'] = features_2d[:, 0]
            df['y'] = None
        centroids_data = []
        if centroids is not None and centroids.size > 0:
            centroids_2d = pca.transform(centroids)
            centroids_data = [{'x': float(c[0]), 'y': float(c[1])} for c in centroids_2d]
        printer.success("PCA complete.")
        return centroids_data
    except Exception as e:
        printer.error(f"Error running PCA: {e}")
        return []