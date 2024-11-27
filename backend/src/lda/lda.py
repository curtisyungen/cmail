from gensim.models.ldamodel import LdaModel
from config import LDA_MODEL_PATH
from .feature_extraction import generate_corpus, load_corpus, save_corpus
from ..utils.preprocess import load_data

def generate_new_corpus():
    df = load_data()
    corpus, dictionary = generate_corpus(df)
    save_corpus(corpus, dictionary)
    return corpus, dictionary

def get_email_topics(lda_model, corpus, threshold = 0.1):
    try:
        email_assignments = []
        dominant_topics = []
        for doc in corpus:
            topic_probabilities = lda_model.get_document_topics(doc)
            assigned_topics = [topic for topic, prob in topic_probabilities if prob > threshold]
            dominant_topic = max(topic_probabilities, key=lambda x: x[1])[0]
            email_assignments.append(assigned_topics)
            dominant_topics.append(dominant_topic)
        return email_assignments, dominant_topics
    except Exception as e:
        print(f"Error getting email topics: {e}")

def print_topics(lda_model):
    try:
        topics = lda_model.print_topics(num_words=10)
        return topics
    except Exception as e:
        print(f"Error printing topics: {e}")

def train_model(corpus, dictionary, num_topics):
    print("Training LDA model...")
    try:
        lda_model = LdaModel(
            corpus=corpus,
            num_topics=num_topics,
            id2word=dictionary,
            passes=10,
            random_state=42
        )
        lda_model.save(LDA_MODEL_PATH)
        print("Training complete.")
        return lda_model
    except Exception as e:
        print(f"Error training model: {e}")

def run_lda(num_topics: int):
    corpus, dictionary = generate_new_corpus()
    lda_model = train_model(corpus, dictionary, num_topics)
    topics = print_topics(lda_model)
    email_assignments, dominant_topics = get_email_topics(lda_model, corpus)

    return topics, dominant_topics, email_assignments

