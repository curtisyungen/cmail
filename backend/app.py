import os
import secrets
from auth import exchange_code_for_token, get_creds
from gmail_service import fetch_emails
from flask import Flask, request, jsonify
from main import run_kmeans_model
from redis_cache import clear_emails_from_redis, get_emails_from_redis, store_emails_in_redis
from src.utils.preprocess import clean_body

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

@app.route("/api/check-authentication", methods=['GET'])
def check_authentication():
    try:
        creds = get_creds()
        if creds:
            return jsonify({'authenticated': True})
        else:
            return jsonify({'authenticated': False})
    except Exception as e:
        print(f"Error checking authentication: {e}")
        return jsonify({'authenticated': False}), 500

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
    limit = request.args.get('limit', default=100, type=int)
    try:
        creds = get_creds()
        if not creds:
            return jsonify({'error': 'Failed to get credentials.'}), 400
        
        emails_df = fetch_emails(creds, limit)
        if emails_df.empty:
            return []
        
        emails_df = clean_body(emails_df)
        store_emails_in_redis(emails_df)

        return jsonify({'emails': emails_df.to_dict(orient='records')})
    except Exception as e:
        print(f"Error fetching emails: {e}")
        return jsonify({'message': str(e)}), 500

@app.route('/api/run-kmeans', methods=['POST'])
def run_kmeans():
    data = request.json
    num_clusters = data.get("numClusters", 12)
    categories = data.get("categories", [])
    lda_config = data.get("ldaConfig", {})

    try:
        emails_df = get_emails_from_redis()

        df, clusters = run_kmeans_model(emails_df, num_clusters, categories, lda_config)
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
    
@app.route('/api/clear-redis', methods=['POST'])
def clear_redis():
    try:
        clear_emails_from_redis()
        response = {
            "status": "success",
            "message": "Emails cleared from Redis.",
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

