import pandas as pd
from src.kmeans.kmeans import run_kmeans

def run_kmeans_model(emails_df: pd.DataFrame, categories: list[str], kmeans_config: dict, lda_config):
    return run_kmeans(
        emails_df=emails_df,
        categories=categories,
        kmeans_config=kmeans_config,
        lda_config=lda_config
    )