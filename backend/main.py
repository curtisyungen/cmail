import pandas as pd
from src.model.clusters.clustering import run_model
from src.utils.postprocess import get_clusters_data, get_email_clusters

def run_model_main(emails_df: pd.DataFrame, categories: list[str], 
                     feature_config: dict, model_config: dict,
                    naming_config: dict, stopwords: list[str]):
    df, clusters, silhouette_score, centroids_data, elbow_data, keyword_counts = run_model(
        emails_df=emails_df,
        categories=categories,
        feature_config=feature_config,
        model_config=model_config,
        naming_config=naming_config,
        custom_stopwords=stopwords
    )
    email_clusters = get_email_clusters(df)
    clusters_data = get_clusters_data(df)
    return {
        'clusters': clusters,
        'email_clusters': email_clusters,
        'silhouette_score': silhouette_score,
        'keyword_counts': keyword_counts,
        'centroids_data': centroids_data,
        'clusters_data': clusters_data,
        'elbow_data': elbow_data,
    }