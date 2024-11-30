import React, { createContext, useContext, useReducer } from "react";

import { ALL_TOPICS, DEFAULT_CATEGORIES } from "./res";

export const AppContext = createContext();

const initialState = {
    categories: DEFAULT_CATEGORIES,
    emails: [],
    loading: false,
    selectedEmail: null,
    selectedTopic: ALL_TOPICS,
    topics: [],
    topicsMap: {},
};

export const ACTIONS = {
    SET_CATEGORIES: "set_categories",
    SET_EMAILS: "set_email",
    SET_LOADING: "set_loading",
    SET_SELECTED_EMAIL: "set_selected_email",
    SET_SELECTED_TOPIC: "set_selected_topic",
    SET_TOPICS: "set_topics",
    SET_TOPICS_MAP: "set_topics_map",
};

export const useAppContext = () => useContext(AppContext);

export const appReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_CATEGORIES:
            return { ...state, categories: action.payload };
        case ACTIONS.SET_EMAILS:
            return { ...state, emails: action.payload };
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };
        case ACTIONS.SET_SELECTED_EMAIL:
            return { ...state, selectedEmail: action.payload };
        case ACTIONS.SET_SELECTED_TOPIC:
            return { ...state, selectedTopic: action.payload };
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
