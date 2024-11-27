import json
import pandas as pd
import pprint
from gensim.models.ldamodel import LdaModel
from config import EMAILS, LDA_MODEL_PATH
from .feature_extraction import generate_corpus, save_corpus
from ..utils.preprocess import clean_body

def load_data():
    print("Loading data...")
    data = []
    with open(EMAILS, 'r', encoding="utf-8") as file:
        data = json.load(file)
    cleaned_df = clean_body(pd.DataFrame(data))
    print("Complete.")
    return cleaned_df

def print_topics():
    lda_model = LdaModel.load(LDA_MODEL_PATH)
    topics = lda_model.print_topics(num_words=10)
    pprint.pprint(topics)

def run_lda():
    df = load_data()
    corpus, dictionary = generate_corpus(df)
    save_corpus(corpus, dictionary)

    print("Training LDA model...")
    lda_model = LdaModel(
        corpus=corpus,
        num_topics=10,
        id2word=dictionary,
        passes=10,
        random_state=42
    )
    lda_model.save(LDA_MODEL_PATH)
    print("Training complete.")
    print_topics()

