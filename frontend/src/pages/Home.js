import React, { useEffect, useState } from "react";

import { ClusterList, Header } from "../components";
import { EmailList, EmailReader, EmptyStateView } from "../components/emails";
import { ALL_CLUSTERS } from "../res";
import { Box, Colors as COLORS, Flex } from "../styles";
import DIMENS from "../styles/Dimens";

const Home = () => {
    const [clusters, setClusters] = useState({});
    const [emailClusters, setEmailClusters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshEmails, setRefreshEmails] = useState(true);
    const [selectedCluster, setSelectedCluster] = useState(ALL_CLUSTERS);
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
            overflow="hidden"
        >
            <Box
                margin={{
                    left: DIMENS.HOME_PADDING,
                    right: DIMENS.HOME_PADDING,
                    top: DIMENS.HOME_PADDING,
                }}
                width="unset"
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
                <Box height={DIMENS.SPACING_STANDARD} width="100%" />
                <Box
                    height={DIMENS.EMAIL_LIST_HEIGHT}
                    justifyContent="flex-start"
                    overflow="hidden"
                >
                    <Flex
                        alignItems="flex-start"
                        style={{ overflow: "hidden" }}
                    >
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
                        <Box height="100%" width={DIMENS.SPACING_STANDARD} />
                        {selectedEmail ? (
                            <EmailReader selectedEmail={selectedEmail} />
                        ) : (
                            <EmptyStateView />
                        )}
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
