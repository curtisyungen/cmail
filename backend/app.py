from flask import Flask, request, jsonify
from main import main, ModelType

app = Flask(__name__)

@app.route('/api/run-model', methods=['POST'])
def run_model():
    data = request.json
    model_type = data.get("model_type", "kmeans").lower()
    generate = data.get("generate", False)

    # Map string to ModelType Enum
    model_enum = ModelType(model_type.upper())

    try:
        # Call your main function
        main(model_type=model_enum, generate=generate)
        return jsonify({"status": "success", "message": f"Ran {model_enum.value} model."}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)