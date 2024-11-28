from sentence_transformers import SentenceTransformer, util
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

CATEGORY_LABELS = ["Apartments", "Finance", "Health", "Payment", "Personal", "Piano", "School", "Travel"]

def generate_smart_label(keywords):
    print("Generating smart label...")
    try:
        if not keywords:
            print("Missing keywords")
            return "Unknown"
        keywords = [kw.lower() for kw in keywords]
        predefined_labels = [label.lower() for label in CATEGORY_LABELS]
        topic_representation = ' '.join(keywords)
        topic_embedding = model.encode(topic_representation, convert_to_tensor=True)
        label_embeddings = model.encode(predefined_labels, convert_to_tensor=True)
        similarities = util.pytorch_cos_sim(topic_embedding, label_embeddings).numpy().flatten()
        best_label_idx = np.argmax(similarities)
        print(f"best_label_idx: {best_label_idx}")
        best_label = predefined_labels[best_label_idx]
        print(f"best_label: {best_label}")
        return best_label
    except Exception as e:
        import traceback
        print(f"Error generating label: {traceback.format_exc()}")
        return "Unknown"
          
