import { useContext } from "react";
import { AppContext, ACTIONS } from "../AppContext";

const useAppActions = () => {
    const { dispatch } = useContext(AppContext);

    const setAuthenticated = (authenticated) => {
        dispatch({ type: ACTIONS.SET_AUTHENTICATED, payload: authenticated });
    };

    const setCategories = (categories) => {
        dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories });
    };

    const setEmails = (emails) => {
        dispatch({ type: ACTIONS.SET_EMAILS, payload: emails });
    };

    const setKMeansConfig = (config) => {
        dispatch({ type: ACTIONS.SET_KMEANS_CONFIG, payload: config });
    };

    const setKMeansData = (data) => {
        dispatch({ type: ACTIONS.SET_KMEANS_DATA, payload: data });
    };

    const setLdaConfig = (ldaConfig) => {
        dispatch({ type: ACTIONS.SET_LDA_CONFIG, payload: ldaConfig });
    };

    const setNumEmails = (numEmails) => {
        dispatch({ type: ACTIONS.SET_NUM_EMAILS, payload: numEmails });
    };

    const setSelectedEmail = (email) => {
        dispatch({ type: ACTIONS.SET_SELECTED_EMAIL, payload: email });
    };

    const setSelectedTopic = (topic) => {
        dispatch({ type: ACTIONS.SET_SELECTED_TOPIC, payload: topic });
    };

    const setStatus = (status) => {
        dispatch({ type: ACTIONS.SET_STATUS, payload: status });
    };

    const setTopics = (topics) => {
        dispatch({ type: ACTIONS.SET_TOPICS, payload: topics });
    };

    const setTopicsMap = (topicsMap) => {
        dispatch({ type: ACTIONS.SET_TOPICS_MAP, payload: topicsMap });
    };

    return {
        setAuthenticated,
        setCategories,
        setEmails,
        setKMeansConfig,
        setKMeansData,
        setLdaConfig,
        setNumEmails,
        setSelectedEmail,
        setSelectedTopic,
        setStatus,
        setTopics,
        setTopicsMap,
    };
};

export default useAppActions;
