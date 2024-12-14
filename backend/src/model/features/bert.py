from transformers import AlbertTokenizer, AlbertModel
import torch
from ...utils.custom_print import CustomPrint

printer = CustomPrint()

def initialize_bert(model_name='albert-base-v2'):
    try:
        tokenizer = AlbertTokenizer.from_pretrained(model_name)
        model = AlbertModel.from_pretrained(model_name)
        model.eval()
        return tokenizer, model
    except Exception as e:
        printer.error(f"Error initializing BERT: {e}")
        return None, None

def preprocess_texts(texts, tokenizer, max_length=128):
    inputs = tokenizer(
        texts,
        padding=True,
        truncation=True,
        max_length=max_length,
        return_tensors="pt"
    )
    return inputs

def get_bert_embeddings(texts, tokenizer, model, pooling='mean', device='cpu', max_length=256):
    try:
        model.to(device)
        inputs = preprocess_texts(texts, tokenizer, max_length=max_length)
        with torch.no_grad():
            outputs = model(
                input_ids=inputs['input_ids'].to(device),
                attention_mask=inputs['attention_mask'].to(device)
            )
            hidden_states = outputs.last_hidden_state
            if pooling == 'mean':
                embeddings = torch.mean(hidden_states, dim=1).cpu().numpy()
            elif pooling == 'cls':
                embeddings = hidden_states[:, 0, :].cpu().numpy()
            else:
                raise ValueError("Invalid pooling method. Choose 'mean' or 'cls'.")
        return embeddings
    except Exception as e:
        printer.error(f"Error getting BERT embeddings: {e}")
        return None