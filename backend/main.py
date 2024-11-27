from src.kmeans.kmeans import run_kmeans
from src.lda.lda import run_lda
from src.utils import mbox_to_json

def run_kmeans_model(num_clusters: int = 12):
    print(f"Running k-means with {num_clusters} clusters...")
    return run_kmeans(
        num_clusters=num_clusters
    )

def run_lda_model():
    print(f"Running LDA model...")
    return run_lda()

def generate_new_data(email_count: int = 100):
    print(f"Generating data...")
    return mbox_to_json(email_count=email_count)