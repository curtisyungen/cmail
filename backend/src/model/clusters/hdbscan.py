import hdbscan
import pandas as pd

def run_hdbscan(df, features, min_cluster_size, min_samples):
    try:
        print("Running HDBSCAN...")
        clusterer = hdbscan.HDBSCAN(min_cluster_size=min_cluster_size, min_samples=min_samples, 
                                    gen_min_span_tree=True)
        clusterer.fit(features)
        df['cluster_id'] = clusterer.labels_
        print("HDBSCAN complete.")
        return df
    except Exception as e:
        print(f"Error running HDBSCAN: {e}")
        return pd.DataFrame()