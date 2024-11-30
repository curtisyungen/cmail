import gensim
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from gensim import corpora
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def match_topic(keywords, categories, threshold=0.8):
    vectorizer = CountVectorizer(stop_words='english')
    predefined_vector = vectorizer.fit_transform(categories)
    keywords_vector = vectorizer.transform(keywords)

    similarities = cosine_similarity(keywords_vector, predefined_vector)
    best_match = None
    max_similarity = 0

    for score in similarities:
        similarity = max(score)
        if similarity > max_similarity:
            max_similarity = similarity
            best_match = categories[score.argmax()]
    
    if max_similarity >= threshold:
        return best_match
    else:
        return None

def generate_label(keywords, categories):
    if not keywords:
        return "Unknown"
    try:
        # Try to match cluster keywords to a pre-defined category
        if categories:
            matched_topic = match_topic(keywords, categories)
            if matched_topic:
                return matched_topic
        
        # Otherwise come up with a new category
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
    
def run_lda(cluster, keywords, categories, no_below, no_above, num_topics):
    print(f"cluster {cluster}, num. keywords: {len(keywords)}")
    if not keywords:
        return []
    try:
        dictionary = corpora.Dictionary([keywords])
        # dictionary.filter_extremes(no_below=no_below, no_above=no_above)
        corpus = [dictionary.doc2bow(keywords)]

        lda_model = gensim.models.LdaMulticore(corpus, num_topics=num_topics, id2word=dictionary, passes=10)
        lda_topics = []
        for _, words in lda_model.show_topics(num_topics=num_topics, formatted=False):
            sorted_keywords = [word for word, _ in words]
            label = generate_label(sorted_keywords, categories)
            lda_topics.append({
                'topic_id': int(cluster),
                'keywords': [{'word': word, 'weight': float(weight)} for word, weight in words],
                'label': label
            })
        return lda_topics
    except Exception as e:
        print(f"Error running LDA: {e}")