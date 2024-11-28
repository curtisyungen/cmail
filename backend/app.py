import json
import os
from flask import Flask, request, jsonify
from main import generate_new_data, run_kmeans_model, run_lda_model
from config import EMAILS

app = Flask(__name__)

@app.route('/api/run-kmeans', methods=['POST'])
def run_kmeans():
    data = request.json
    num_clusters = data.get("numClusters", 12)
    categories = data.get("categories", [])

    try:
        df, clusters = run_kmeans_model(num_clusters, categories)
        email_clusters = df[['body', 'cluster_label']].astype({'cluster_label': int})
        email_clusters['id'] = email_clusters.index
        email_clusters = email_clusters[['id', 'body', 'cluster_label']].to_dict(orient='records')
        response = {
            "status": "success",
            "message": "Ran K-means model.",
            "clusters": clusters,
            "email_clusters": email_clusters
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/run-lda', methods=['POST'])
def run_lda():
    data = request.json
    num_topics = data.get("numTopics", 10)
    no_below = data.get("noBelow", 2)
    no_above = data.get("noAbove", 0.5)
    try:
        topics, dominant_topics, email_assignments, topic_labels = run_lda_model(
            num_topics, 
            no_below, 
            no_above
        )
        response = {
            "status": "success",
            "message": "Ran LDA model.",
            "topics": topics,
            "dominant_topics": dominant_topics,
            "email_assignments": email_assignments,
            "topic_labels": topic_labels
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/generate-data', methods=['POST'])
def generate_data():
    data = request.json
    email_count = data.get("emailCount", 100)
    try:
        generate_new_data(email_count)
        response = {
            "status": "success",
            "message": "Data generated successfully.",
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/get-emails', methods=['GET'])
def get_emails():
    try:
        if not os.path.exists(EMAILS):
            return jsonify({"status": "error", "message": "File not found"}), 404
        with open(EMAILS, 'r', encoding="utf-8") as file:
            email_data = json.load(file)
        return jsonify({"status": "success", "emails": email_data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
