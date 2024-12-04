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

    const setError = (error) => {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error });
    };

    const setFeatureConfig = (featureConfig) => {
        dispatch({ type: ACTIONS.SET_FEATURE_CONFIG, payload: featureConfig });
    };

    const setLdaConfig = (ldaConfig) => {
        dispatch({ type: ACTIONS.SET_LDA_CONFIG, payload: ldaConfig });
    };

    const setModelConfig = (config) => {
        dispatch({ type: ACTIONS.SET_MODEL_CONFIG, payload: config });
    };

    const setModelResult = (result) => {
        dispatch({ type: ACTIONS.SET_MODEL_RESULT, payload: result });
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

    const setTab = (tab) => {
        dispatch({ type: ACTIONS.SET_TAB, payload: tab });
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
        setError,
        setFeatureConfig,
        setLdaConfig,
        setModelConfig,
        setModelResult,
        setNumEmails,
        setSelectedEmail,
        setSelectedTopic,
        setStatus,
        setTab,
        setTopics,
        setTopicsMap,
    };
};

export default useAppActions;
