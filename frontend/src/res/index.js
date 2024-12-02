import { COLORS } from "../styles";

export const MODEL = {
    AUTOENCODER: "Autoencoder",
    BERT: "BERT",
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

export const DEFAULT_KMEANS_CONFIG = Object.freeze({
    include_labels: false,
    include_senders: false,
    include_subject: false,
    num_clusters: 12,
});

export const DEFAULT_LDA_CONFIG = Object.freeze({
    no_below: 1,
    no_above: 1,
    num_topics: 1,
    use_categories: true,
});

export const DEFAULT_NEURAL_CONFIG = Object.freeze({
    encoding_dim: 256,
    model: MODEL.AUTOENCODER,
    num_epochs: 50,
});

export const DEFAULT_NUM_EMAILS = 500;

export const LS = {
    CATEGORIES: "categories",
    CLUSTERS: "clusters",
    EMAIL_CLUSTERS: "email_clusters",
    KMEANS_DATA: "kmeans_data",
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

export const UNKNOWN_SENDER = "Unknown Sender";
