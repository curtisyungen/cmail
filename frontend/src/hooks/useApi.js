import axios from "axios";

import useAppActions from "./useAppActions";
import useAppContext from "./useAppContext";
import { ALL_TOPICS, LS, MODEL, STATUS } from "../res";
import { StorageUtils, Utils } from "../utils";
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
        setEmailToTopicIdMap,
        setError,
        setModelResult,
        setSelectedTopic,
        setStatus,
        setTopics,
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
        setModelResult({});
        setSelectedTopic(ALL_TOPICS);
        setTopics([]);
        setEmailToTopicIdMap({});
        try {
            const response = await axios.get("/api/fetch-emails", {
                params: { limit: numEmails },
            });
            console.log("fetchEmails response: ", response);
            if (response.status === 200) {
                setEmails(Utils.parseJSON(response.data)?.emails || []);
            } else {
                console.log(response.data.message || "Failed to fetch emails.");
            }
        } catch (e) {
            console.error("Error fetching emails: ", e);
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

    const processSubClusters = (clusters) => {
        try {
            const parentClusterMap = {};
            for (const cluster of clusters) {
                const { parent_id } = cluster;
                if (parent_id >= 0 && parent_id !== null) {
                    if (!parentClusterMap[parent_id]) {
                        parentClusterMap[parent_id] = [];
                    }
                    parentClusterMap[parent_id].push(cluster);
                }
            }
            const finalClusters = [];
            for (const cluster of clusters) {
                const { parent_id, topic_id } = cluster;
                if (parent_id >= 0 && parent_id !== null) continue;
                finalClusters.push({
                    ...cluster,
                    subtopics: parentClusterMap[topic_id]
                        ? parentClusterMap[topic_id]
                        : [],
                });
            }
            return finalClusters;
        } catch (e) {
            console.error("Error processing clusters: ", e);
            return clusters;
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
            console.log("runModel response: ", res.data);

            const { email_clusters } = res.data;
            const clusters = handleEmptyClusters(res.data.clusters);
            const finalClusters =
                modelConfig.model === MODEL.CLUSTERING.LAYERED_KMEANS
                    ? processSubClusters(clusters)
                    : clusters;

            const emailToTopicIdMap = {};
            for (const { cluster_id, id } of email_clusters) {
                emailToTopicIdMap[id] = cluster_id;
            }

            setModelResult(res.data);
            setTopics(finalClusters);
            setEmailToTopicIdMap(emailToTopicIdMap);
            StorageUtils.setItem(LS.CLUSTERS, finalClusters);
            StorageUtils.setItem(LS.EMAIL_CLUSTERS, email_clusters);
            StorageUtils.setItem(LS.MODEL_RESULT, res.data);

            addToHistory({
                id: Math.ceil(Math.random() * 1000),
                featureConfig,
                modelConfig,
                numClusters: clusters.length,
                numSubClusters: clusters.length - finalClusters.length,
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
        getEmailAddress,
        runModel,
    };
};

export default useApi;
