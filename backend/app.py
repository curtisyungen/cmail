import os
import pandas as pd
import secrets
from auth import exchange_code_for_token, get_creds
from flask import Flask, request, jsonify
from gmail_service import fetch_emails
from io import StringIO
from main import run_kmeans_model
from redis_cache import clear_redis_values, get_value_from_redis, store_value_in_redis
from src.utils.preprocess import clean_body
from config import REDIS_KEYS

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
        
        emails_df, loaded_from_redis = fetch_emails(creds, limit)
        if emails_df is None or emails_df.empty:
            return []
        
        if not loaded_from_redis:
            emails_df = clean_body(emails_df)
            store_value_in_redis(REDIS_KEYS.EMAILS, emails_df.to_json(orient='records'))

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
        # Emails should be fetched/stored before run_kmeans() is ever called
        emails = get_value_from_redis(REDIS_KEYS.EMAILS)
        emails_df = pd.read_json(StringIO(emails))

        df, clusters, silhouette_score = run_kmeans_model(emails_df, num_clusters, categories, lda_config)
        
        email_clusters = df[['body', 'cluster_id']].astype({'cluster_id': int})
        email_clusters['id'] = email_clusters.index
        email_clusters = email_clusters[['id', 'body', 'cluster_id']].to_dict(orient='records')
        
        clusters_data = []
        for cluster_id in df['cluster_id'].unique():
            cluster_points = df[df['cluster_id'] == cluster_id]
            clusters_data.append({
                'cluster_id': int(cluster_id),
                'x': cluster_points['x'].tolist(),
                'y': cluster_points['y'].tolist()
            })

        response = {
            "status": "success",
            "message": "Ran K-means model.",
            "clusters": clusters,
            "email_clusters": email_clusters,
            "clusters_data": clusters_data,
            "silhouette_score": silhouette_score
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/clear-redis', methods=['POST'])
def clear_redis():
    try:
        clear_redis_values()
        response = {
            "status": "success",
            "message": "Emails cleared from Redis.",
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

