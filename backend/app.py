import json
import os
from flask import Flask, request, jsonify
from main import main
from config import EMAILS

app = Flask(__name__)
DATA_FOLDER = os.path.join(os.path.dirname(__file__), 'data')

@app.route('/api/run-model', methods=['POST'])
def run_model():
    data = request.json
    generate = data.get("generate", False)
    email_count = data.get("emailCount", 100)
    num_clusters = data.get("numClusters", 12)

    try:
        cluster_keywords = main(generate, email_count, num_clusters)
        response = {
            "status": "success",
            "message": "Ran K-means model.",
            "clusters": cluster_keywords
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/get-emails', methods=['GET'])
def get_emails():
    try:
        if not os.path.exists(EMAILS):
            return jsonify({"status": "error", "message": "File not found"}), 404
        with open(EMAILS, 'r') as file:
            email_data = json.load(file)
        return jsonify({"status": "success", "emails": email_data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
