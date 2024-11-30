import os
import requests

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT_DIR, 'data')
MODELS_DIR = os.path.join(ROOT_DIR, 'models')

CORPUS_PATH = os.path.join(DATA_DIR, 'corpus.mm')
DICT_PATH = os.path.join(DATA_DIR, 'dictionary.dict')
LDA_MODEL_PATH = os.path.join(MODELS_DIR, 'lda_model.gensim')

stopwords_list = requests.get("https://gist.githubusercontent.com/rg089/35e00abf8941d72d419224cfd5b5925d/raw/12d899b70156fd0041fa9778d657330b024b959c/stopwords.txt").content
stopwords = set(stopwords_list.decode().splitlines()) 
stopwords.update(["completed", "curtis", "curtisyungen", "gmail", "need", "subject", "thing", "today", "unsubscribe", "yungen"])
