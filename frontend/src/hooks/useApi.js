import axios from "axios";

import useAppActions from "./useAppActions";
import useAppContext from "./useAppContext";
import { LS, STATUS } from "../res";
import { StorageUtils } from "../utils";

const useApi = () => {
    const { categories, ldaConfig, numEmails, status } = useAppContext();
    const {
        setAuthenticated,
        setEmails,
        setKMeansData,
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
        } catch (err) {
            console.error("Error fetching emails: ", err);
        } finally {
            setStatus(null);
        }
    };

    const runKMeans = async ({ numClusters }) => {
        function getClustersValid(clusters) {
            if (!clusters || clusters.length === 0) {
                return false;
            }
            for (const cluster in clusters) {
                if (cluster === null) {
                    return false;
                }
            }
            return true;
        }

        setStatus(STATUS.RUNNING_KMEANS);
        setTopics([]);

        try {
            const res = await axios.post("/api/run-kmeans", {
                numClusters,
                categories: categories.map(({ name }) => name),
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
        } catch (error) {
            console.error(error.response?.data?.message || "An error occurred");
        } finally {
            setStatus(null);
        }
    };

    return {
        authenticateUser,
        clearEmailsFromRedis,
        clearRedis,
        fetchEmails,
        runKMeans,
    };
};

export default useApi;
