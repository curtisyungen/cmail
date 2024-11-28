from src.kmeans.kmeans import run_kmeans
from src.lda.lda import run_lda
from src.utils.mbox_to_json import mbox_to_json

def run_kmeans_model(num_clusters: int = 12, categories: list[str] = [], lda_config = None):
    print(f"Running k-means with {num_clusters} clusters...")
    return run_kmeans(
        num_clusters=num_clusters,
        categories=categories,
        lda_config=lda_config
    )

def run_lda_model(num_topics: int, no_below: int, no_above: float):
    print(f"Running LDA model...")
    return run_lda(num_topics=num_topics, no_below=no_below, no_above=no_above)

def generate_new_data(email_count: int = 100):
    print(f"Generating data...")
    return mbox_to_json(email_count=email_count)