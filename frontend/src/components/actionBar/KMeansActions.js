import React, { useEffect, useState } from "react";
import axios from "axios";

import { Icon } from "../common";
import { useAppActions, useAppContext } from "../../hooks";
import { LS } from "../../res";
import { ICON } from "../../res/icons";
import {
    Box,
    COLORS,
    DIMENS,
    Flex,
    FONT_SIZE,
    Select,
    Text,
} from "../../styles";
import { StorageUtils } from "../../utils";

const DEFAULT_NUM_CLUSTERS = 12;

const KMeansActions = ({ isRunning, setIsRunning }) => {
    const { categories, emails, ldaConfig } = useAppContext();
    const { setClustersData, setTopics, setTopicsMap } = useAppActions();

    const [error, setError] = useState(null);
    const [numClusters, setNumClusters] = useState(DEFAULT_NUM_CLUSTERS);

    useEffect(() => {
        const savedClusters = StorageUtils.getItem(LS.CLUSTERS);
        const savedClustersData = StorageUtils.getItem(LS.CLUSTERS_DATA);
        const savedEmailClusters = StorageUtils.getItem(LS.EMAIL_CLUSTERS);
        setClustersData(savedClustersData || []);
        setTopics(savedClusters || []);
        setTopicsMap(savedEmailClusters || {});
    }, []);

    const getClustersValid = (clusters) => {
        if (!clusters || clusters.length === 0) {
            return false;
        }
        for (const cluster in clusters) {
            if (cluster === null) {
                return false;
            }
        }
        return true;
    };

    const handleRunKmeans = async () => {
        if (isRunning) {
            return;
        }
        setIsRunning(true);
        setTopics([]);
        setError("");

        try {
            const res = await axios.post("/api/run-kmeans", {
                numClusters,
                categories: categories.map(({ name }) => name),
                ldaConfig,
            });
            console.log("response: ", res.data);

            const { clusters, clusters_data, email_clusters } = res.data;

            console.log("clusters: ", clusters);

            if (getClustersValid(clusters)) {
                setClustersData(clusters_data);
                setTopics(clusters);
                setTopicsMap(email_clusters);

                StorageUtils.setItem(LS.CLUSTERS, clusters);
                StorageUtils.setItem(LS.CLUSTERS_DATA, clusters_data);
                StorageUtils.setItem(LS.EMAIL_CLUSTERS, email_clusters);
            } else {
                console.log("Invalid clusters: ", clusters);
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <>
            <Flex>
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={!isRunning && emails?.length > 0}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        isRunning || emails?.length === 0
                            ? COLORS.TRANSPARENT
                            : COLORS.GRAY_LIGHT
                    }
                    onClick={handleRunKmeans}
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={
                            isRunning ? COLORS.GRAY_MEDIUM : COLORS.BLUE_DARK
                        }
                        name={ICON.RUN}
                        size={26}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text center fontSize={FONT_SIZE.S}>
                        {isRunning ? "Running" : "Run"}
                    </Text>
                </Box>
                <Box style={{ flex: 1 }}>
                    <Select
                        disabled={isRunning}
                        onChange={(e) =>
                            setNumClusters(parseInt(e.target.value))
                        }
                        style={{
                            marginBottom: "5px",
                        }}
                        value={numClusters}
                        width={DIMENS.SELECT_WIDTH}
                    >
                        {Array.from(
                            { length: 20 },
                            (_, index) => index + 1
                        ).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </Select>
                    <Text center fontSize={FONT_SIZE.S}>
                        No. Clusters
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>K-means</Text>
        </>
    );
};

export default KMeansActions;
