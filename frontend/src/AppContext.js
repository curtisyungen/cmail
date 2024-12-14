import React, { createContext, useContext, useReducer } from "react";

import {
    ALL_TOPICS,
    DEFAULT_CATEGORIES,
    DEFAULT_FEATURE_CONFIG,
    DEFAULT_NAMING_CONFIG,
    DEFAULT_MODEL_CONFIG,
    DEFAULT_NUM_EMAILS,
    TABS,
    VIEW,
    DEFAULT_STOPWORDS,
} from "./res";

export const AppContext = createContext();

const initialState = {
    activeView: VIEW.INBOX,
    authenticated: false,
    categories: DEFAULT_CATEGORIES,
    emailAddress: null,
    emails: [],
    emailToTopicIdMap: {},
    error: false,
    featureConfig: DEFAULT_FEATURE_CONFIG,
    history: [],
    modelConfig: DEFAULT_MODEL_CONFIG,
    modelResult: {},
    namingConfig: DEFAULT_NAMING_CONFIG,
    numEmails: DEFAULT_NUM_EMAILS,
    searchTerm: "",
    selectedEmail: null,
    selectedTopic: ALL_TOPICS,
    showLoading: true,
    showNavigationPane: true,
    status: null,
    stopwords: DEFAULT_STOPWORDS,
    tab: TABS.MODEL,
    topics: [],
};

export const ACTIONS = {
    SET_ACTIVE_VIEW: "set_active_view",
    SET_AUTHENTICATED: "set_authenticated",
    SET_CATEGORIES: "set_categories",
    SET_EMAIL_ADDRESS: "set_email_address",
    SET_EMAILS: "set_email",
    SET_EMAIL_TO_TOPIC_ID_MAP: "set_email_to_topic_id_map",
    SET_ERROR: "set_error",
    SET_FEATURE_CONFIG: "set_feature_config",
    SET_HISTORY: "set_history",
    SET_MODEL_CONFIG: "set_model_config",
    SET_MODEL_RESULT: "set_model_result",
    SET_NAMING_CONFIG: "set_naming_config",
    SET_NUM_EMAILS: "set_num_emails",
    SET_SEARCH_TERM: "set_search_term",
    SET_SELECTED_EMAIL: "set_selected_email",
    SET_SELECTED_TOPIC: "set_selected_topic",
    SET_SHOW_LOADING: "set_show_loading",
    SET_SHOW_NAVIGATION_PANE: "set_show_navigation_pane",
    SET_STOPWORDS: "set_stop_words",
    SET_TAB: "set_tab",
    SET_STATUS: "set_status",
    SET_TOPICS: "set_topics",
};

export const useAppContext = () => useContext(AppContext);

export const appReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_ACTIVE_VIEW:
            return { ...state, activeView: action.payload };
        case ACTIONS.SET_AUTHENTICATED:
            return { ...state, authenticated: action.payload };
        case ACTIONS.SET_CATEGORIES:
            return { ...state, categories: action.payload };
        case ACTIONS.SET_EMAIL_ADDRESS:
            return { ...state, emailAddress: action.payload };
        case ACTIONS.SET_EMAILS:
            return { ...state, emails: action.payload };
        case ACTIONS.SET_EMAIL_TO_TOPIC_ID_MAP:
            return { ...state, emailToTopicIdMap: action.payload };
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };
        case ACTIONS.SET_FEATURE_CONFIG:
            return { ...state, featureConfig: action.payload };
        case ACTIONS.SET_HISTORY:
            return { ...state, history: action.payload };
        case ACTIONS.SET_MODEL_CONFIG:
            return { ...state, modelConfig: action.payload };
        case ACTIONS.SET_NAMING_CONFIG:
            return { ...state, namingConfig: action.payload };
        case ACTIONS.SET_MODEL_RESULT:
            return { ...state, modelResult: action.payload };
        case ACTIONS.SET_NUM_EMAILS:
            return { ...state, numEmails: action.payload };
        case ACTIONS.SET_SEARCH_TERM:
            return { ...state, searchTerm: action.payload };
        case ACTIONS.SET_SELECTED_EMAIL:
            return { ...state, selectedEmail: action.payload };
        case ACTIONS.SET_SELECTED_TOPIC:
            return { ...state, selectedTopic: action.payload };
        case ACTIONS.SET_SHOW_LOADING:
            return { ...state, showLoading: action.payload };
        case ACTIONS.SET_SHOW_NAVIGATION_PANE:
            return { ...state, showNavigationPane: action.payload };
        case ACTIONS.SET_STATUS:
            return { ...state, status: action.payload };
        case ACTIONS.SET_STOPWORDS:
            return { ...state, stopwords: action.payload };
        case ACTIONS.SET_TAB:
            return { ...state, tab: action.payload };
        case ACTIONS.SET_TOPICS:
            return { ...state, topics: action.payload };
        default:
            return state;
    }
};

export const AppContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
