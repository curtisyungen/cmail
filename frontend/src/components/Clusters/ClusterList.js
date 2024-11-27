import React, { useEffect, useState } from "react";

import Cluster from "./Cluster";
import { Box, Flex, Text } from "../../styles";

const ClusterList = ({ clusters, selectedCluster, setSelectedCluster }) => {
    const handleClusterClick = (cluster) => {
        setSelectedCluster(selectedCluster === cluster ? "All" : cluster);
    };

    return (
        <Box padding={{ left: 10, right: 10 }} width={150}>
            <Cluster
                title="All"
                keywords={[]}
                onClick={() => handleClusterClick(null)}
                selectedCluster={selectedCluster}
            />
            {Object.entries(clusters).map(([_, keywords], idx) => (
                <Cluster
                    key={idx}
                    title={`Cluster ${idx}`}
                    keywords={keywords}
                    onClick={handleClusterClick}
                    selectedCluster={selectedCluster}
                />
            ))}
        </Box>
    );
};

export default ClusterList;
