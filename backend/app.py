import json
import os
from auth import exchange_code_for_token, get_creds
from gmail_service import fetch_emails
from flask import Flask, request, jsonify
from main import generate_new_data, run_kmeans_model
from config import EMAILS

app = Flask(__name__)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

@app.route("/api/authenticate", methods=['POST'])
def authenticate():
    try:
        auth_code = request.json.get('code')
        if not auth_code:
            return jsonify({'error': 'Authorization code is required'}), 400

        exchange_code_for_token(auth_code)
        return jsonify({'message': 'User authenticated.'})
    except Exception as e:
        print(f"Error authenticating: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/fetch-emails", methods=['GET'])
def fetch_emails_for_user():
    limit = request.json.get("limit")
    try:
        creds = get_creds()
        if not creds or not creds.get('access_token') or not creds.get('refresh_token'):
            return jsonify({'error': 'Failed to get credentials.'}), 400
        emails = fetch_emails(creds, limit)
        return jsonify({'messages': emails})
    except Exception as e:
        print(f"Error fetching emails: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/run-kmeans', methods=['POST'])
def run_kmeans():
    data = request.json
    num_clusters = data.get("numClusters", 12)
    categories = data.get("categories", [])
    lda_config = data.get("ldaConfig", {})

    try:
        df, clusters = run_kmeans_model(num_clusters, categories, lda_config)
        email_clusters = df[['body', 'cluster_id']].astype({'cluster_id': int})
        email_clusters['id'] = email_clusters.index
        email_clusters = email_clusters[['id', 'body', 'cluster_id']].to_dict(orient='records')
        response = {
            "status": "success",
            "message": "Ran K-means model.",
            "clusters": clusters,
            "email_clusters": email_clusters
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
