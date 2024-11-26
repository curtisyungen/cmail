import React, { useEffect, useState } from "react";

import { ClusterViewer, EmailViewer, Header } from "../components";
import { Box, Colors as COLORS } from "../styles";

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
        <Box
            background={COLORS.GRAY_LIGHT}
            height="100vh"
            justifyContent="flex-start"
            padding={{ left: 30, top: 30 }}
        >
            <Header
                clusters={clusters}
                loading={loading}
                selectedCluster={selectedCluster}
                setClusters={handleSetClusters}
                setEmailClusters={setEmailClusters}
                setLoading={setLoading}
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
