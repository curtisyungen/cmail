import axios from "axios";

import useAppActions from "./useAppActions";
import useAppContext from "./useAppContext";
import { ALL_TOPICS, LS, STATUS } from "../res";
import { StorageUtils } from "../utils";

const useApi = () => {
    const { categories, kmeansConfig, ldaConfig, numEmails, status } =
        useAppContext();
    const {
        setAuthenticated,
        setEmails,
        setKMeansData,
        setSelectedTopic,
        setStatus,
        setTopics,
        setTopicsMap,
    } = useAppActions();

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
            const response = await axios.post("/api/remove-emails-from-redis");
            console.log("response: ", response);
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

    const runKMeans = async () => {
        function getClustersValid(clusters) {
            try {
                if (!clusters || clusters.length === 0) {
                    return false;
                }
                for (const cluster of clusters) {
                    if (
                        cluster === null ||
                        cluster.length === 0 ||
                        !cluster[0].hasOwnProperty("topic_id")
                    ) {
                        return false;
                    }
                }
                return true;
            } catch (e) {
                console.error("Error checking cluster validity: ", e);
                return false;
            }
        }

        setStatus(STATUS.RUNNING_KMEANS);
        setKMeansData({});
        setSelectedTopic(ALL_TOPICS);
        setTopics([]);

        try {
            const res = await axios.post("/api/run-kmeans", {
                categories: ldaConfig.use_categories
                    ? categories.map(({ name }) => name)
                    : [],
                kmeansConfig,
                ldaConfig,
            });
            console.log("response: ", res.data);

            const { clusters, email_clusters } = res.data;

            if (getClustersValid(clusters)) {
                setKMeansData(res.data);
                setTopics(clusters);
                setTopicsMap(email_clusters);
                StorageUtils.setItem(LS.KMEANS_DATA, res.data);
                StorageUtils.setItem(LS.CLUSTERS, clusters);
                StorageUtils.setItem(LS.EMAIL_CLUSTERS, email_clusters);
            } else {
                console.error("Invalid clusters: ", clusters);
            }
        } catch (e) {
            console.error(e.response?.data?.message || "An error occurred");
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
        runKMeans,
    };
};

export default useApi;
