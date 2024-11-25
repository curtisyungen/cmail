import argparse
from enum import Enum
from src.kmeans.kmeans import run_kmeans
from src.neural.neural import run_neural
from src.regression.regression import run_regression

class ModelType(Enum):
    KMEANS = "kmeans"
    NEURAL = "neural"
    REGRESSION = "regression"

def main(model_type: ModelType = ModelType.KMEANS, generate: bool = False):
    if model_type == ModelType.KMEANS:
        print("Running k-means...")
        run_kmeans(generate)
    elif model_type == ModelType.NEURAL:
        print("Running neural network...")
        run_neural()
    elif model_type == ModelType.REGRESSION:
        print("Running regression...")
        run_regression()
    else:
        print(f"Invalid model type: {model_type}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Choose the model type to run.')
    parser.add_argument('model', choices=[ModelType.KMEANS.value, ModelType.NEURAL.value, ModelType.REGRESSION.value],
                        help="The model type to run: 'kmeans', 'neural', or 'regression'")
    parser.add_argument('--generate', action="store_true", 
                        help="Flag to indicate whether to generate new data")
    args = parser.parse_args()
    main(ModelType(args.model), generate=args.generate)