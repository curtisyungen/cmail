from openai import OpenAI
from utils.custom_print import CustomPrint

client = OpenAI()
printer = CustomPrint()

def generate_label_with_open_ai(cluster, keywords, categories):
    try:
        printer.status(f"Labeling cluster {cluster} with Open AI...")
        prompt = (
            "You are a naming assistant for an email clustering system. Based on the provided "
            "keywords, suggest a short and descriptive name for the cluster. If the keywords are "
            "too vague, come up with a reasonable label. Provide ONLY THE LABEL in your response, and "
            "ensure it is concise. For example, if the keywords are 'Priceline, flight, ticket, "
            "itinerary, San Jose', respond with 'San Jose flight' or something similarly descriptive. "
            "The label should be between 1-3 words, with a preference for shorter labels if they "
            "capture enough meaning."
        )
        if categories:
            prompt += (
                f"\n\nIf the following categories are provided: {', '.join(categories)}, "
                "try to match the cluster to one of them. If none of the categories fit well, "
                "create a new, meaningful label. If a cluster does match one of the categories, "
                "return that category name verbatim."
            )
        prompt += f"\n\nKeywords: {', '.join(keywords)}"
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": "You are an AI assistant specialized in generating labels."},
                {"role": "user", "content": prompt}
            ])
        cluster_name = completion.choices[0].message.content
        printer.success(f"Label generated with Open AI: {cluster_name}")
        return cluster_name
    except Exception as e:
        printer.error(f"Error generating cluster name with Open AI: {e}")
        return None
