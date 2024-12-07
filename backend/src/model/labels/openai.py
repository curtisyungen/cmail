from openai import OpenAI

client = OpenAI()

def generate_label_with_open_ai(cluster, keywords):
    try:
        print(f"Labeling cluster {cluster} with Open AI...")
        prompt = (
            "You are a naming assistant for an email clustering system. Based on the "
            "provided keywords, suggest a short and descriptive name for the cluster. "
            "If the keywords are too vague, guess a reasonable label. Provide only the label "
            "in your response and nothing else. For example, if the keywords are 'Priceline, flight, "
            "ticket, itinerary, San Jose', you'd respond with 'San Jose flight', or something to that "
            "effect. Keep the label between 1-3 words long, with a preference for shorter labels if they "
            "capture enough meaning from the list of keywords. "
            "Keywords: " + ", ".join(keywords)
        )
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": "You are an AI assistant specialized in generating labels."},
                {"role": "user", "content": prompt}
            ])
        cluster_name = completion.choices[0].message.content
        print(f"Label generated with Open AI: {cluster_name}")
        return cluster_name
    except Exception as e:
        print(f"Error generating cluster name with Open AI: {e}")
        return None
