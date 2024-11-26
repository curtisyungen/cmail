import argparse
from src.kmeans.kmeans import run_kmeans

def main(generate: bool = False, email_count: int = 100, num_clusters: int = 12):
    print("Running k-means...")
    df, cluster_keywords, cluster_topics = run_kmeans(
        generate_data=generate, email_count=email_count, num_clusters = num_clusters)
    return df, cluster_keywords, cluster_topics

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Choose whether to generate new data.')
    parser.add_argument('--generate', action="store_true", 
                        help="Flag to indicate whether to generate new data")
    parser.add_argument('--email_count', type=int, default=100,
                        help="Number of emails to use (default: 100)")
    parser.add_argument('--num_clusters', type=int, default=100,
                    help="Number of clusters to use (default: 12)")
    args = parser.parse_args()
    main(generate=args.generate, email_count=args.email_count)