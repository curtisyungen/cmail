import React, { useEffect, useState } from "react";
import axios from "axios";

import Email from "./Email";
import { Box, List } from "../../styles";

const EmailList = ({
    emailClusters,
    loading,
    refreshEmails,
    selectedCluster,
}) => {
    const [clusterMap, setClusterMap] = useState({});
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState(null);
    const [loadingEmails, setLoadingEmails] = useState(false);

    useEffect(() => {
        if (loading) {
            setEmails([]);
            setError(null);
        }
    }, [loading]);

    useEffect(() => {
        if (!loading && refreshEmails) {
            fetchEmails();
        }
    }, [loading, refreshEmails]);

    useEffect(() => {
        if (emailClusters) {
            const clusterMap = emailClusters.reduce(
                (map, { cluster_label, id }) => {
                    map[id] = cluster_label;
                    return map;
                },
                {}
            );
            setClusterMap(clusterMap);
        }
    }, [emailClusters]);

    async function fetchEmails() {
        try {
            const response = await axios.get("/api/get-emails");
            if (response.data.status === "success") {
                setEmails(response.data.emails);
            } else {
                setError(response.data.message || "Failed to fetch emails.");
            }
        } catch (err) {
            console.log("Error: ", err);
            setError("Error connecting to the server.");
        } finally {
            setLoadingEmails(false);
        }
    }

    if (loadingEmails) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <List
            canScrollY
            height={`calc(100vh - 300px)`}
            style={{ minWidth: "300px" }}
            width="fit-content"
        >
            {emails.map((email, idx) => (
                <Email
                    key={idx}
                    cluster={clusterMap[email.id]}
                    email={email}
                    selectedCluster={selectedCluster}
                />
            ))}
        </List>
    );
};

export default EmailList;
