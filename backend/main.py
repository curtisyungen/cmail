import pandas as pd
from src.kmeans.kmeans import run_kmeans

def run_kmeans_model(emails_df: pd.DataFrame, num_clusters: int = 12, categories: list[str] = [], lda_config = None):
    print(f"Running k-means with {num_clusters} clusters...")
    return run_kmeans(
        emails_df=emails_df,
        num_clusters=num_clusters,
        categories=categories,
        lda_config=lda_config
    )