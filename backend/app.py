import os
import pandas as pd
import secrets
from flask import Flask, request, jsonify
from io import StringIO
from auth import exchange_code_for_token, get_creds
from main import run_model_main
from config import REDIS_KEYS
from emails import get_emails, get_email_address
from redis_cache import clear_redis_values, get_value_from_redis, remove_value_from_redis
from src.utils.custom_print import CustomPrint

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

printer = CustomPrint()

@app.route("/api/check-authentication", methods=['GET'])
def check_authentication():
    try:
        creds = get_creds()
        if creds:
            return jsonify({'authenticated': True})
        else:
            return jsonify({'authenticated': False})
    except Exception as e:
        printer.error(f"Error checking authentication: {e}")
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
        printer.error(f"Error authenticating: {e}")
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
        printer.error(f"Error fetching emails: {e}")
        return jsonify({'message': str(e)}), 500
    
@app.route("/api/get-email-address", methods=['GET'])
def get_email_address_route():
    try:
        creds = get_creds()
        if not creds:
            return jsonify({'error': 'Failed to get credentials.'}), 400
        email_address = get_email_address(creds)
        return jsonify({'email_address': email_address})
    except Exception as e:
        printer.error(f"Error getting email address: {e}")
        return jsonify({'message': str(e)}), 500

@app.route('/api/run-model', methods=['POST'])
def run_model_route():
    data = request.json
    categories = data.get("categories", [])
    feature_config = data.get("featureConfig", {})
    model_config = data.get("modelConfig", {})
    naming_config = data.get("namingConfig", {})
    stopwords = data.get("stopwords", [])

    try:
        # Emails should always be loaded/stored before run_model() is called
        emails = get_value_from_redis(REDIS_KEYS.EMAILS)
        if not emails:
            return jsonify({'error', 'No emails found.'}), 404
        emails_df = pd.read_json(StringIO(emails))
        model_response = run_model_main(
            emails_df, 
            categories, 
            feature_config,
            model_config,
            naming_config,
            stopwords
        )
        return jsonify({
            "status": "success",
            "message": "Ran K-means model.",
            "clusters": model_response.get('clusters'),
            "email_clusters": model_response.get('email_clusters'),
            "silhouette_score": model_response.get('silhouette_score'),
            "centroids_data": model_response.get('centroids_data'),
            "keyword_counts": model_response.get('keyword_counts'),
            "clusters_data": model_response.get('clusters_data'),
            "elbow_data": model_response.get('elbow_data'),
            "invalid_emails": model_response.get('invalid_emails'),
            "config": model_response.get('config')
        }), 200
    except Exception as e:
        printer.error(f"Error running model: {e}")
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
        printer.error(f"Error clearing Redis: {e}")
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
        printer.error(f"Error removing emails from Redis: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

