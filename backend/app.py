from flask import Flask, request, jsonify
from main import main

app = Flask(__name__)

@app.route('/api/run-model', methods=['POST'])
def run_model():
    data = request.json
    generate = data.get("generate", False)
    email_count = data.get("emailCount", 100)
    num_clusters = data.get("numClusters", 12)

    try:
        df, cluster_keywords, cluster_topics = main(generate, email_count, num_clusters)
        email_clusters = df[['body', 'cluster_label']].copy()
        email_clusters['cluster_label'] = email_clusters['cluster_label'].astype(int)
        email_clusters = df[['body', 'cluster_label']].to_dict(orient='records')
        response = {
            "status": "success",
            "message": "Ran K-means model.",
            "clusters": cluster_keywords,
            "topics": cluster_topics,
            "emails": email_clusters
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
