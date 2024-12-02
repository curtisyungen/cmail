import React, { createContext, useContext, useReducer } from "react";

import {
    ALL_TOPICS,
    DEFAULT_CATEGORIES,
    DEFAULT_MODEL_CONFIG,
    DEFAULT_LDA_CONFIG,
    DEFAULT_FEATURE_CONFIG,
    DEFAULT_NUM_EMAILS,
    TABS,
} from "./res";

export const AppContext = createContext();

const initialState = {
    authenticated: false,
    categories: DEFAULT_CATEGORIES,
    emails: [],
    featureConfig: DEFAULT_FEATURE_CONFIG,
    ldaConfig: DEFAULT_LDA_CONFIG,
    modelConfig: DEFAULT_MODEL_CONFIG,
    modelResult: {},
    numEmails: DEFAULT_NUM_EMAILS,
    selectedEmail: null,
    selectedTopic: ALL_TOPICS,
    status: null,
    tab: TABS.MODEL,
    topics: [],
    topicsMap: {},
};

export const ACTIONS = {
    SET_AUTHENTICATED: "set_authenticated",
    SET_CATEGORIES: "set_categories",
    SET_EMAILS: "set_email",
    SET_FEATURE_CONFIG: "set_feature_config",
    SET_LDA_CONFIG: "set_lda_config",
    SET_MODEL_CONFIG: "set_model_config",
    SET_MODEL_RESULT: "set_model_result",
    SET_NUM_EMAILS: "set_num_emails",
    SET_SELECTED_EMAIL: "set_selected_email",
    SET_SELECTED_TOPIC: "set_selected_topic",
    SET_TAB: "set_tab",
    SET_STATUS: "set_status",
    SET_TOPICS: "set_topics",
    SET_TOPICS_MAP: "set_topics_map",
};

export const useAppContext = () => useContext(AppContext);

export const appReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_AUTHENTICATED:
            return { ...state, authenticated: action.payload };
        case ACTIONS.SET_CATEGORIES:
            return { ...state, categories: action.payload };
        case ACTIONS.SET_EMAILS:
            return { ...state, emails: action.payload };
        case ACTIONS.SET_FEATURE_CONFIG:
            return { ...state, featureConfig: action.payload };
        case ACTIONS.SET_LDA_CONFIG:
            return { ...state, ldaConfig: action.payload };
        case ACTIONS.SET_MODEL_CONFIG:
            return { ...state, modelConfig: action.payload };
        case ACTIONS.SET_MODEL_RESULT:
            return { ...state, modelResult: action.payload };
        case ACTIONS.SET_NUM_EMAILS:
            return { ...state, numEmails: action.payload };
        case ACTIONS.SET_SELECTED_EMAIL:
            return { ...state, selectedEmail: action.payload };
        case ACTIONS.SET_SELECTED_TOPIC:
            return { ...state, selectedTopic: action.payload };
        case ACTIONS.SET_STATUS:
            return { ...state, status: action.payload };
        case ACTIONS.SET_TAB:
            return { ...state, tab: action.payload };
        case ACTIONS.SET_TOPICS:
            return { ...state, topics: action.payload };
        case ACTIONS.SET_TOPICS_MAP:
            return { ...state, topicsMap: action.payload };
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
