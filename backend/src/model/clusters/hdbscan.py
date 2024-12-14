import hdbscan
import pandas as pd
from ...utils.custom_print import CustomPrint

printer = CustomPrint()

def run_hdbscan(df, features, min_cluster_size, min_samples):
    try:
        printer.status("Running HDBSCAN...")
        clusterer = hdbscan.HDBSCAN(min_cluster_size=min_cluster_size, min_samples=min_samples, 
                                    gen_min_span_tree=True)
        clusterer.fit(features)
        df['cluster_id'] = clusterer.labels_
        printer.success("HDBSCAN complete.")
        return df
    except Exception as e:
        printer.error(f"Error running HDBSCAN: {e}")
        return pd.DataFrame()