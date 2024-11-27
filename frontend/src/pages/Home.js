import React, { useEffect, useState } from "react";

import { ClusterList, EmailList, EmailReader, Header } from "../components";
import { Box, Colors as COLORS, Flex } from "../styles";
import DIMENS from "../styles/Dimens";

const Home = () => {
    const [clusters, setClusters] = useState({});
    const [emailClusters, setEmailClusters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshEmails, setRefreshEmails] = useState(true);
    const [selectedCluster, setSelectedCluster] = useState("All");
    const [selectedEmail, setSelectedEmail] = useState(null);

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
            padding={{
                left: DIMENS.HOME_LEFT_PADDING,
                top: DIMENS.HOME_TOP_PADDING,
            }}
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
            <Box height={10} width="100%" />
            <Box
                height={`calc(100vh - ${DIMENS.HOME_TOP_PADDING}px - ${DIMENS.HEADER_HEIGHT}px)`}
                justifyContent="flex-start"
            >
                <Flex alignItems="flex-start">
                    <ClusterList
                        clusters={clusters}
                        selectedCluster={selectedCluster}
                        setSelectedCluster={setSelectedCluster}
                    />
                    <EmailList
                        emailClusters={emailClusters}
                        loading={loading}
                        refreshEmails={refreshEmails}
                        selectedCluster={selectedCluster}
                        selectedEmail={selectedEmail}
                        setSelectedEmail={setSelectedEmail}
                    />
                    <Box height="100%" width={10} />
                    {selectedEmail ? (
                        <EmailReader selectedEmail={selectedEmail} />
                    ) : (
                        <></>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

export default Home;
