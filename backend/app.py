from flask import Flask, request, jsonify
from main import main

app = Flask(__name__)

@app.route('/api/run-model', methods=['POST'])
def run_model():
    data = request.json
    generate = data.get("generate", False)

    try:
        main(generate=generate)
        return jsonify({"status": "success", "message": f"Ran K-means model."}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)