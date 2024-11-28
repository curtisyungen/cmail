import gensim
import numpy as np
from gensim import corpora
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_label(keywords, categories):
    try:
        if not keywords:
            print("Missing keywords")
            return "Unknown"
        keywords = [kw.lower() for kw in keywords]
        predefined_labels = [label.lower() for label in categories]
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

def run_lda(cluster, keywords, categories, no_below, no_above, num_topics=1):
    print(f"Running LDA...")
    try:
        dictionary = corpora.Dictionary([keywords])
        dictionary.filter_extremes(no_below=no_below, no_above=no_above)
        corpus = [dictionary.doc2bow(keywords)]

        lda_model = gensim.models.LdaMulticore(corpus, num_topics=num_topics, id2word=dictionary, passes=10)
        lda_topics = []
        for _, words in lda_model.show_topics(num_topics=num_topics, formatted=False):
            keywords = [word for word, _ in words]
            label = generate_label(keywords, categories)
            lda_topics = {
                "topic_id": int(cluster),
                "keywords": [{"word": word, "weight": float(weight)} for word, weight in words],
                "label": label
            }
        print("LDA complete.")
        return lda_topics
    except Exception as e:
        print(f"Error running LDA: {e}")