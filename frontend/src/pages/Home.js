import React, { useEffect, useState } from "react";

import { ClusterViewer, EmailViewer, SettingsBar } from "../components";
import { Box } from "../styles";

const Home = () => {
    const [clusters, setClusters] = useState({});
    const [emailClusters, setEmailClusters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshEmails, setRefreshEmails] = useState(true);
    const [selectedCluster, setSelectedCluster] = useState(-1);

    useEffect(() => {
        if (refreshEmails) {
            setRefreshEmails(false);
        }
    }, [refreshEmails]);

    const handleSetClusters = (clusters) => {
        setClusters(clusters);
        setRefreshEmails(true);
    };

    return (
        <Box padding={10}>
            <SettingsBar
                loading={loading}
                setClusters={handleSetClusters}
                setEmailClusters={setEmailClusters}
                setLoading={setLoading}
            />
            <ClusterViewer
                clusters={clusters}
                selectedCluster={selectedCluster}
                setSelectedCluster={setSelectedCluster}
            />
            <EmailViewer
                emailClusters={emailClusters}
                loading={loading}
                refreshEmails={refreshEmails}
                selectedCluster={selectedCluster}
            />
        </Box>
    );
};

export default Home;
