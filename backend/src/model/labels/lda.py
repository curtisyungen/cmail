import gensim
from gensim import corpora

def run_lda(cluster, keywords, no_below, no_above, num_topics=1):
    print(f"cluster {cluster}, num. keywords: {len(keywords)}")
    if not keywords:
        return []
    try:
        dictionary = corpora.Dictionary([keyword] for keyword in keywords)
        dictionary.filter_extremes(no_below=no_below, no_above=no_above)
        corpus = [dictionary.doc2bow(keywords)]
        lda_model = gensim.models.LdaMulticore(
            corpus, 
            num_topics=num_topics, 
            id2word=dictionary, 
            passes=20, 
            iterations=200
        )
        topics = lda_model.show_topics(num_topics=num_topics, formatted=False)
        sorted_keywords = [word for word, _ in topics[0][1]]
        return sorted_keywords
    except Exception as e:
        print(f"Error running LDA: {e}")
        return []