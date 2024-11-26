import React, { useEffect, useState } from "react";

import { ClusterKeywords, EmailList, SettingsBar } from "../components";
import { Box } from "../styles";

const Home = () => {
    const [clusters, setClusters] = useState({});
    const [refreshEmails, setRefreshEmails] = useState(true);

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
            <SettingsBar setClusters={handleSetClusters} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                {Object.entries(clusters).map(([_, keywords], idx) => (
                    <div key={idx}>
                        <ClusterKeywords title={idx + 1} keywords={keywords} />
                    </div>
                ))}

                <EmailList refreshEmails={refreshEmails} />
            </div>
        </Box>
    );
};

export default Home;
