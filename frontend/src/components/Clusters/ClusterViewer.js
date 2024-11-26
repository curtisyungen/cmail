import React, { useEffect, useState } from "react";

import Cluster from "./Cluster";
import { Box, Flex, Text } from "../../styles";

const ClusterViewer = ({ clusters, selectedCluster, setSelectedCluster }) => {
    const handleClusterClick = (cluster) => {
        setSelectedCluster(selectedCluster === cluster ? null : cluster);
    };

    return (
        <Box>
            <Text>Clusters</Text>
            <Flex alignItems="flex-start" flexWrap>
                {Object.entries(clusters).map(([_, keywords], idx) => (
                    <Cluster
                        key={idx}
                        title={idx}
                        keywords={keywords}
                        onClick={handleClusterClick}
                        selectedCluster={selectedCluster}
                    />
                ))}
            </Flex>
        </Box>
    );
};

export default ClusterViewer;
