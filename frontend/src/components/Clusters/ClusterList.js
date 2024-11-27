import React, { useEffect, useState } from "react";

import Cluster from "./Cluster";
import { ALL_CLUSTERS } from "../../res";
import { Box } from "../../styles";
import DIMENS from "../../styles/Dimens";

const ClusterList = ({ clusters, selectedCluster, setSelectedCluster }) => {
    const handleClusterClick = (cluster) => {
        setSelectedCluster(
            selectedCluster === cluster ? ALL_CLUSTERS : cluster
        );
    };

    return (
        <Box
            margin={{ right: DIMENS.SPACING_STANDARD }}
            padding={{ left: 10 }}
            width="fit-content"
        >
            <Cluster
                title={ALL_CLUSTERS}
                keywords={[]}
                onClick={() => handleClusterClick(null)}
                selectedCluster={selectedCluster}
            />
            {Object.entries(clusters).map(([_, keywords], idx) => (
                <Cluster
                    key={idx}
                    title={idx}
                    keywords={keywords}
                    onClick={handleClusterClick}
                    selectedCluster={selectedCluster}
                />
            ))}
        </Box>
    );
};

export default ClusterList;
