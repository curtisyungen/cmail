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

    const setClustersData = (clustersData) => {
        dispatch({ type: ACTIONS.SET_CLUSTERS_DATA, payload: clustersData });
    };

    const setEmails = (emails) => {
        dispatch({ type: ACTIONS.SET_EMAILS, payload: emails });
    };

    const setLdaConfig = (ldaConfig) => {
        dispatch({ type: ACTIONS.SET_LDA_CONFIG, payload: ldaConfig });
    };

    const setLoading = (loading) => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
    };

    const setSelectedEmail = (email) => {
        dispatch({ type: ACTIONS.SET_SELECTED_EMAIL, payload: email });
    };

    const setSelectedTopic = (topic) => {
        dispatch({ type: ACTIONS.SET_SELECTED_TOPIC, payload: topic });
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
        setClustersData,
        setEmails,
        setLdaConfig,
        setLoading,
        setSelectedEmail,
        setSelectedTopic,
        setTopics,
        setTopicsMap,
    };
};

export default useAppActions;
