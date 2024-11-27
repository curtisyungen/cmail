from gensim import corpora
from gensim.models import TfidfModel
from config import CORPUS_PATH, DICT_PATH
from ..utils.preprocess import clean_and_tokenize

def generate_corpus(df):
    print("Generating corpus...")
    df["tokens"] = df['body'].apply(clean_and_tokenize)

    dictionary = corpora.Dictionary(df['tokens'])
    dictionary.filter_extremes(no_below=2, no_above=0.5, keep_n=10000)
    corpus = [dictionary.doc2bow(tokens) for tokens in df["tokens"]]

    tfidf_model = TfidfModel(corpus)
    tfidf_corpus = tfidf_model[corpus]
    
    print("Generation complete.")
    return tfidf_corpus, dictionary

def load_corpus():
    print("Loading corpus...")
    try:
        corpus = corpora.MmCorpus.load(CORPUS_PATH)
        dictionary = corpora.Dictionary.load(DICT_PATH)
        print("Success.")
        return corpus, dictionary
    except Exception as e:
        print(f"Error loading corpus: {e}")
        
def save_corpus(corpus, dictionary):
    print("Saving corpus...")
    try:
        corpora.MmCorpus.serialize(CORPUS_PATH, corpus)
        dictionary.save(DICT_PATH)
        print("Saving complete.")
    except Exception as e:
        print(f"Error saving corpus: {e}")