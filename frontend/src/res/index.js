import { COLORS } from "../styles";

export const APP_NAME = "Cmail";

export const MODEL = {
    CLUSTERING: {
        KMEANS: "K-means",
        HDBSCAN: "HDBSCAN",
    },
    FEATURE_EXTRACTION: {
        AUTOENCODER: "Autoencoder",
        BERT: "BERT",
    },
    TOPIC_NAMING: {
        LDA: "LDA",
        OPEN_AI: "Open AI",
    },
};

export const ALL_TOPICS = "All";

export const DEFAULT_CATEGORIES = [
    { name: "Apartments", color: COLORS.YELLOW },
    { name: "Health", color: COLORS.GREEN },
    { name: "Investments", color: COLORS.BLACK },
    { name: "Meeting", color: COLORS.ORANGE },
    { name: "Payment", color: COLORS.RED },
    { name: "Personal", color: COLORS.PURPLE },
    { name: "Piano", color: COLORS.BLACK },
    { name: "Receipt", color: COLORS.BLUE_DARK },
    { name: "School", color: COLORS.GRAY_MEDIUM },
    { name: "Travel", color: COLORS.PINK },
];

export const DEFAULT_MODEL_CONFIG = Object.freeze({
    model: MODEL.CLUSTERING.KMEANS,
    num_clusters: 12,
});

export const DEFAULT_NAMING_CONFIG = Object.freeze({
    model: MODEL.TOPIC_NAMING.LDA,
    no_below: 1,
    no_above: 1,
    num_topics: 1,
    use_categories: false,
});

export const DEFAULT_FEATURE_CONFIG = Object.freeze({
    encoding_dim: 256,
    include_bodies: true,
    include_capitals: false,
    include_dates: false,
    include_labels: false,
    include_recipients: false,
    include_senders: false,
    include_subjects: false,
    include_thread_ids: false,
    max_email_length: null,
    model: null,
    num_epochs: 50,
});

export const DEFAULT_NUM_EMAILS = 500;

export const LS = {
    CATEGORIES: "categories",
    CLUSTERS: "clusters",
    EMAIL_CLUSTERS: "email_clusters",
    HISTORY: "history",
    MODEL_RESULT: "model_result",
    STOPWORDS: "stopwords",
};

export const PAGES = {
    HOME: "/home",
    LOGIN: "/",
};

export const STATUS = {
    AUTHENTICATING: "authenticating",
    FETCHING_EMAILS: "fetching_emails",
    FETCHING_LABELS: "fetching_labels",
    RUNNING_KMEANS: "running_kmeans",
};

export const TABS = {
    MODEL: "Model",
    DATA: "Data",
};

export const UNKNOWN_SENDER = "Unknown Sender";

export const VIEW = {
    INBOX: "Inbox",
    HISTORY: "History",
};
