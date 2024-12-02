import os
import pandas as pd
import secrets
from flask import Flask, request, jsonify
from io import StringIO
from auth import exchange_code_for_token, get_creds
from main import run_kmeans_model
from config import REDIS_KEYS
from emails import get_emails, fetch_labels
from redis_cache import clear_redis_values, get_value_from_redis, remove_value_from_redis

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
        
        emails_df = get_emails(creds, limit)
        if emails_df is None or emails_df.empty:
            return jsonify({'error': 'No emails found.'}), 404

        return jsonify({'emails': emails_df.to_dict(orient='records')})
    except Exception as e:
        print(f"Error fetching emails: {e}")
        return jsonify({'message': str(e)}), 500
    
@app.route("/api/fetch-labels", methods=['GET'])
def fetch_labels_for_user():
    try:
        creds = get_creds()
        if not creds:
            return jsonify({'error': 'Failed to get credentials.'}), 400
        labels = fetch_labels(creds)
        return jsonify({'labels': labels})
    except Exception as e:
        print(f"Error fetching labels: {e}")
        return jsonify({'message': str(e)}), 500

@app.route('/api/run-kmeans', methods=['POST'])
def run_kmeans():
    data = request.json
    categories = data.get("categories", [])
    feature_config = data.get("featureConfig", {})
    kmeans_config = data.get("kmeansConfig", {})
    lda_config = data.get("ldaConfig", {})

    try:
        # Emails should always be loaded/stored before run_kmeans() is called
        emails = get_value_from_redis(REDIS_KEYS.EMAILS)
        if not emails:
            return jsonify({'error', 'No emails found.'}), 404
        
        emails_df = pd.read_json(StringIO(emails))

        df, clusters, silhouette_score = run_kmeans_model(
            emails_df, 
            categories, 
            kmeans_config, 
            lda_config,
            feature_config
        )
        
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
            "message": "All values cleared from Redis.",
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/remove-emails-from-redis', methods=['POST'])
def remove_emails_from_redis():
    try:
        remove_value_from_redis(REDIS_KEYS.EMAILS)
        response = {
            "status": "success",
            "message": "Emails cleared from Redis.",
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

