from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
from .lda import run_lda
from .openai import generate_label_with_open_ai

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
        return "Unknown", False
    try:
        # Try to match cluster keywords to a pre-defined category
        if categories:
            matched_topic = match_topic(keywords, categories)
            if matched_topic:
                return matched_topic, False
        
        # Otherwise come up with a new category
        topic_representation = ' '.join(keywords)
        topic_embedding = model.encode(topic_representation, convert_to_tensor=True)
        keyword_embeddings = model.encode(keywords, convert_to_tensor=True)
        similiarities = util.pytorch_cos_sim(topic_embedding, keyword_embeddings).numpy().flatten()
        best_idx = similiarities.argmax()
        final_keyword = keywords[best_idx].title()
        return final_keyword, True
    except Exception as e:
        print(f"Error generating label: {e}")
        return "Unknown", False

def label_clusters(cluster_column, cluster_keywords, cluster_keyword_counts, categories, naming_config):
    try:
        topic_naming_model = naming_config.get('model')
        print(f"Labeling clusters using {topic_naming_model}, {len(categories)} categories, and config {naming_config}...")

        clusters_with_labels = []
        for cluster in cluster_column.unique():
            keywords = cluster_keywords[int(cluster)]
            top_keywords = [{'word': word } for word, _ in cluster_keyword_counts[int(cluster)]]

            if topic_naming_model == "LDA":
                no_above = naming_config.get('no_above')
                no_below = naming_config.get('no_below')
                lda_keywords = run_lda(cluster, keywords, no_below=no_below, no_above=no_above, num_topics=1)
                label, generated = generate_label(lda_keywords, categories)
            elif topic_naming_model == "Open AI":
                top_keywords_as_strings = [kw['word'] for kw in top_keywords]
                label = generate_label_with_open_ai(cluster, top_keywords_as_strings)
                generated = True
            else:
                label, generated = generate_label(keywords, categories)

            clusters_with_labels.append([{
                'topic_id': int(cluster),
                'keywords': top_keywords,
                'label': label,
                'generated': generated # Whether it was generated from model or came from pre-defined categories
            }])
        print("Labeling complete.")
        return clusters_with_labels
    except Exception as e:
        print(f"Error labeling clusters: {e}")
        return []