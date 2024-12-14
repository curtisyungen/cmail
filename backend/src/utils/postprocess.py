from .custom_print import CustomPrint

printer = CustomPrint()

# For charting cluster data
def get_clusters_data(df):
    try:
        clusters_data = []
        for cluster_id in df['cluster_id'].unique():
            cluster_data = df[df['cluster_id'] == cluster_id]
            email_data = cluster_data[['date', 'from', 'raw_subject']].to_dict(orient='records')
            clusters_data.append({
                'cluster_id': int(cluster_id),
                'x': cluster_data['x'].tolist(),
                'y': cluster_data['y'].tolist(),
                'email_data': email_data
            })
        return clusters_data
    except Exception as e:
        printer.error(f"Error getting cluster data: {e}")
        return []

def get_email_clusters(df):
    try:
        return df[['id', 'body', 'cluster_id']].astype({'cluster_id': int}).to_dict(orient='records')
    except Exception as e:
        printer.error(f"Error getting email clusters: {e}")
        return []
