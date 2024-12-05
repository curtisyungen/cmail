import pandas as pd
from src.model.clustering import run_model

def run_model_main(emails_df: pd.DataFrame, categories: list[str], 
                     feature_config: dict, model_config: dict,
                    naming_config: dict):
    return run_model(
        emails_df=emails_df,
        categories=categories,
        feature_config=feature_config,
        model_config=model_config,
        naming_config=naming_config,
    )