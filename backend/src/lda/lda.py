from gensim.models.ldamodel import LdaModel
from config import LDA_MODEL_PATH, stopwords
from .feature_extraction import generate_corpus, load_corpus, save_corpus
from ..utils.preprocess import load_data

def clean_topic_label(label):
    label_words = label.split()
    cleaned_label = [word for word in label_words if word not in stopwords]
    return ' '.join(cleaned_label)

def generate_new_corpus(no_below, no_above):
    df = load_data()
    corpus, dictionary = generate_corpus(df, no_below=no_below, no_above=no_above)
    save_corpus(corpus, dictionary)
    return corpus, dictionary

def generate_topic_labels(lda_model, num_words):
    topic_labels = []
    topics = lda_model.print_topics(num_words=num_words)
    for topic in topics:
        words = [word.split("*")[1].replace('"', '').strip() for word in topic[1].split(" + ")]
        label = ' '.join(words[:num_words])
        label = clean_topic_label(label)
        topic_labels.append(label)
    return topic_labels

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

def run_lda(num_topics: int, no_below: int, no_above: float):
    print(f"Running LDA with no_below {no_below}, no_above {no_above}, and num_topics {num_topics}")
    corpus, dictionary = generate_new_corpus(no_below, no_above)
    lda_model = train_model(corpus, dictionary, num_topics)
    topic_labels = generate_topic_labels(lda_model)
    topics = print_topics(lda_model)
    email_assignments, dominant_topics = get_email_topics(lda_model, corpus)

    return topics, dominant_topics, email_assignments, topic_labels

