import json
import os
from flask import Flask, request, jsonify
from main import main
from config import EMAILS

app = Flask(__name__)

@app.route('/api/run-model', methods=['POST'])
def run_model():
    data = request.json
    generate = data.get("generate", False)
    email_count = data.get("emailCount", 100)
    num_clusters = data.get("numClusters", 12)

    try:
        df, cluster_keywords = main(generate, email_count, num_clusters)
        email_clusters = df[['body', 'cluster_label']].astype({'cluster_label': int})
        email_clusters['id'] = email_clusters.index
        email_clusters = email_clusters[['id', 'body', 'cluster_label']].to_dict(orient='records')
        response = {
            "status": "success",
            "message": "Ran K-means model.",
            "clusters": cluster_keywords,
            "email_clusters": email_clusters,
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
