import gensim
import numpy as np
from collections import Counter
from gensim import corpora
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def assign_category(keywords, categories):
    try:
        if not keywords:
            return "Unknown"
        keywords = [kw.lower() for kw in keywords]
        lower_categories = [category.lower() for category in categories]
        topic_representation = ' '.join(keywords)
        topic_embedding = model.encode(topic_representation, convert_to_tensor=True)
        category_embeddings = model.encode(lower_categories, convert_to_tensor=True)
        similarities = util.pytorch_cos_sim(topic_embedding, category_embeddings).numpy().flatten()
        category_idx = np.argmax(similarities)
        final_category = lower_categories[category_idx]
        return final_category, category_idx
    except Exception as e:
        print(f"Error generating category: {e}")
        return "Unknown"
    
def generate_label(keywords):
    if not keywords:
        return "Unknown"
    try:
       topic_representation = ' '.join(keywords)
       topic_embedding = model.encode(topic_representation, convert_to_tensor=True)
       keyword_embeddings = model.encode(keywords, convert_to_tensor=True)
       similiarities = util.pytorch_cos_sim(topic_embedding, keyword_embeddings).numpy().flatten()
       best_idx = similiarities.argmax()
       final_keyword = keywords[best_idx].title()
       return final_keyword
    except Exception as e:
        print(f"Error generating label: {e}")
        return "Unknown"

def run_lda(cluster, keywords, categories, no_below, no_above, num_topics=5):
    print(f"cluster {cluster}, keywords: {len(keywords)}")
    if not keywords:
        return []
    try:
        dictionary = corpora.Dictionary([keywords])
        # dictionary.filter_extremes(no_below=no_below, no_above=no_above)
        corpus = [dictionary.doc2bow(keywords)]

        lda_model = gensim.models.LdaMulticore(corpus, num_topics=num_topics, id2word=dictionary, passes=10)
        lda_topics = {}
        for _, words in lda_model.show_topics(num_topics=num_topics, formatted=False):
            sorted_keywords = [word for word, _ in words]
            label = generate_label(sorted_keywords)
            lda_topics = {
                'topic_id': int(cluster),
                'keywords': [{'word': word, 'weight': float(weight)} for word, weight in words],
                'label': label
            }
            
            # category, category_idx = assign_category(keywords, categories)
            # sorted_keywords = sorted(words, key=lambda x: x[1], reverse=True)[:10]
            # top_keywords = [{"word": word, "weight": float(weight)} for word, weight in sorted_keywords]
            # lda_topics = {
            #     "topic_id": int(cluster),
            #     "keywords": top_keywords,
            #     "category": category,
            #     "category_idx": int(category_idx)
            # }
        return lda_topics
    except Exception as e:
        print(f"Error running LDA: {e}")