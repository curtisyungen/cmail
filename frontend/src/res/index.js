import { COLORS } from "../styles";

export const ACTION = {
    KMEANS: "Kmeans",
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

export const DEFAULT_LDA_CONFIG = Object.freeze({
    no_below: 1,
    no_above: 1,
    num_topics: 1,
});

export const LS = {
    CATEGORIES: "categories",
    CLUSTERS: "clusters",
    CLUSTERS_DATA: "clusters_data",
    EMAIL_CLUSTERS: "email_clusters",
};

export const PAGES = {
    HOME: "/home",
    LOGIN: "/",
};

export const UNKNOWN_SENDER = "Unknown Sender";
