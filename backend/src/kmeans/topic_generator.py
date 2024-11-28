import gensim
import numpy as np
from gensim import corpora
from sentence_transformers import SentenceTransformer, util
from ..utils.preprocess import clean_and_tokenize

model = SentenceTransformer("all-MiniLM-L6-v2")

CATEGORY_LABELS = ["Apartments", "Finance", "Health", "Payment", "Personal", "Piano", "School", "Travel"]

def generate_label(keywords):
    print("Generating label...")
    try:
        if not keywords:
            print("Missing keywords")
            return "Unknown"
        keywords = [kw.lower() for kw in keywords]
        predefined_labels = [label.lower() for label in CATEGORY_LABELS]
        topic_representation = ' '.join(keywords)
        topic_embedding = model.encode(topic_representation, convert_to_tensor=True)
        label_embeddings = model.encode(predefined_labels, convert_to_tensor=True)
        similarities = util.pytorch_cos_sim(topic_embedding, label_embeddings).numpy().flatten()
        best_label_idx = np.argmax(similarities)
        best_label = predefined_labels[best_label_idx]
        return best_label
    except Exception as e:
        print(f"Error generating label: {e}")
        return "Unknown"

def run_lda(df, num_topics=5):
    try:
        all_text = df['body'].apply(clean_and_tokenize)
        dictionary = corpora.Dictionary(all_text)
        corpus = [dictionary.doc2bow(text) for text in all_text]

        lda_model = gensim.models.LdaMulticore(corpus, num_topics=num_topics, id2word=dictionary, passes=10)
        lda_topics = []
        for topic_id, words in lda_model.show_topics(num_topics=num_topics, formatted=False):
            keywords = [word for word, _ in words]
            label = generate_label(keywords)
            lda_topics.append({
                "topic_id": topic_id,
                "keywords": [{"word": word, "weight": float(weight)} for word, weight in words],
                "label": label
            })
        
        return lda_topics
    except Exception as e:
        print(f"Error running LDA: {e}")