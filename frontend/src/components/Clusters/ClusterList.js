import React, { useEffect, useState } from "react";

import Cluster from "./Cluster";
import { ALL_CLUSTERS } from "../../res";
import { Box } from "../../styles";
import DIMENS from "../../styles/Dimens";

const ClusterList = ({
    clusters,
    clusterMap,
    selectedCluster,
    setSelectedCluster,
}) => {
    const [clusterTotals, setClusterTotals] = useState({});

    useEffect(() => {
        calculateClusterTotals();
    }, [clusterMap]);

    const calculateClusterTotals = () => {
        if (!clusterMap) {
            return;
        }
        const totals = {};
        let totalEmails = 0;
        for (const cluster of Object.values(clusterMap)) {
            if (!totals[cluster]) {
                totals[cluster] = 0;
            }
            totals[cluster] += 1;
            totalEmails += 1;
        }
        totals[ALL_CLUSTERS] = totalEmails;
        setClusterTotals(totals);
    };

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
                size={clusterTotals[ALL_CLUSTERS]}
            />
            {Object.entries(clusters).map(([_, keywords], idx) => (
                <Cluster
                    key={idx}
                    title={idx}
                    keywords={keywords}
                    onClick={handleClusterClick}
                    selectedCluster={selectedCluster}
                    size={clusterTotals[idx]}
                />
            ))}
        </Box>
    );
};

export default ClusterList;
