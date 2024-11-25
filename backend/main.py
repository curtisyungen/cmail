import argparse
from src.kmeans.kmeans import run_kmeans

def main(generate: bool = False):
    print("Running k-means...")
    run_kmeans(generate_data=generate)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Choose whether to generate new data.')
    parser.add_argument('--generate', action="store_true", 
                        help="Flag to indicate whether to generate new data")
    args = parser.parse_args()
    main(generate=args.generate)