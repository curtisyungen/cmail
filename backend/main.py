from src.kmeans.kmeans import generate_new_data, run_kmeans

def main(num_clusters: int = 12):
    print(f"Running k-means with {num_clusters} clusters...")
    return run_kmeans(
        num_clusters=num_clusters
    )

def generate_data(email_count: int = 100):
    print(f"Generating data...")
    return generate_new_data(email_count=email_count)