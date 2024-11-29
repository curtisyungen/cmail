from src.kmeans.kmeans import run_kmeans
from src.utils.mbox_to_json import mbox_to_json

def run_kmeans_model(num_clusters: int = 12, categories: list[str] = [], lda_config = None):
    print(f"Running k-means with {num_clusters} clusters...")
    return run_kmeans(
        num_clusters=num_clusters,
        categories=categories,
        lda_config=lda_config
    )

def generate_new_data(email_count: int = 100):
    print(f"Generating data...")
    return mbox_to_json(email_count=email_count)