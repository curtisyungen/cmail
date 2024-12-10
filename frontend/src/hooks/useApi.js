import axios from "axios";

import useAppActions from "./useAppActions";
import useAppContext from "./useAppContext";
import { ALL_TOPICS, LS, STATUS } from "../res";
import { StorageUtils } from "../utils";
import useHistory from "./useHistory";

const useApi = () => {
    const {
        categories,
        featureConfig,
        modelConfig,
        namingConfig,
        numEmails,
        status,
        stopwords,
    } = useAppContext();
    const {
        setAuthenticated,
        setEmailAddress,
        setEmails,
        setError,
        setModelResult,
        setSelectedTopic,
        setStatus,
        setTopics,
        setTopicsMap,
    } = useAppActions();
    const { addToHistory } = useHistory();

    const authenticateUser = async (code) => {
        setStatus(STATUS.AUTHENTICATING);
        try {
            const result = await axios.post("/api/authenticate", {
                code,
            });
            if (result.status === 200) {
                setAuthenticated(true);
            } else {
                throw new Error(result.data.message);
            }
        } catch (e) {
            console.error("Error authenticating: ", e);
        } finally {
            setStatus(null);
        }
    };

    const clearEmailsFromRedis = async () => {
        try {
            await axios.post("/api/remove-emails-from-redis");
        } catch (e) {
            console.error("Error clearing emails from Redis: ", e);
        }
    };

    const clearRedis = async () => {
        try {
            const result = await axios.post("/api/clear-redis");
            console.log("clear-redis result: ", result);
        } catch (e) {
            console.error("Error clearing Redis: ", e);
        }
    };

    const fetchEmails = async () => {
        if (status) {
            return;
        }
        setStatus(STATUS.FETCHING_EMAILS);
        try {
            const response = await axios.get("/api/fetch-emails", {
                params: { limit: numEmails },
            });
            console.log("fetch_emails response: ", response);
            if (response.status === 200) {
                setEmails(response.data.emails);
            } else {
                console.log(response.data.message || "Failed to fetch emails.");
            }
        } catch (e) {
            console.error("Error fetching emails: ", e);
        } finally {
            setStatus(null);
        }
    };

    const fetchLabels = async () => {
        if (status) {
            return;
        }
        setStatus(STATUS.FETCHING_LABELS);
        try {
            const response = await axios.get("/api/fetch-labels");
            console.log("fetch-labels response: ", response);
        } catch (e) {
            console.error("Error fetching labels: ", e);
        } finally {
            setStatus(null);
        }
    };

    const getEmailAddress = async () => {
        try {
            const response = await axios.get("/api/get-email-address");
            console.log("get-email-address response: ", response);
            setEmailAddress(response.data.email_address);
        } catch (e) {
            console.error("Error getting email address: ", e);
        }
    };

    const runModel = async () => {
        function handleEmptyClusters(clusters) {
            try {
                if (!clusters || clusters.length === 0) {
                    return [];
                }
                const finalClusters = [];
                for (const cluster of clusters) {
                    if (
                        cluster === null ||
                        cluster.length === 0 ||
                        !cluster[0]?.hasOwnProperty("topic_id")
                    ) {
                        finalClusters.push({
                            generated: false,
                            keywords: [],
                            label: null,
                            topic_id: Math.random(),
                        });
                    } else {
                        finalClusters.push(...cluster);
                    }
                }
                return finalClusters;
            } catch (e) {
                console.error("Error handling empty clusters: ", e);
                return [];
            }
        }

        setStatus(STATUS.RUNNING_MODEL);
        setModelResult({});
        setSelectedTopic(ALL_TOPICS);
        setTopics([]);

        try {
            const res = await axios.post("/api/run-model", {
                categories: namingConfig.use_categories
                    ? categories.map(({ name }) => name)
                    : [],
                featureConfig,
                modelConfig,
                namingConfig,
                stopwords,
            });
            console.log("response: ", res.data);

            const { email_clusters } = res.data;
            const clusters = handleEmptyClusters(res.data.clusters);

            setModelResult(res.data);
            setTopics(clusters);
            setTopicsMap(email_clusters);
            StorageUtils.setItem(LS.CLUSTERS, clusters);
            StorageUtils.setItem(LS.EMAIL_CLUSTERS, email_clusters);
            StorageUtils.setItem(LS.MODEL_RESULT, res.data);

            addToHistory({
                featureConfig,
                modelConfig,
                numClusters: clusters.length,
                numEmails,
                silhouetteScore: res.data.silhouette_score,
            });
        } catch (e) {
            console.error(
                "Error running model: ",
                e.response?.data?.message || "An error occurred"
            );
            setError(true);
        } finally {
            setStatus(null);
        }
    };

    return {
        authenticateUser,
        clearEmailsFromRedis,
        clearRedis,
        fetchEmails,
        fetchLabels,
        getEmailAddress,
        runModel,
    };
};

export default useApi;
