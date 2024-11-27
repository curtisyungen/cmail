import React, { useEffect, useState } from "react";
import axios from "axios";

import { Icon } from "../common";
import { ACTION } from "../../res";
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
const LS_CLUSTERS = "clusters";
const LS_EMAIL_CLUSTERS = "email_clusters";

const KMeansActions = ({
    activeAction,
    setActiveAction,
    setClusters,
    setEmailClusters,
}) => {
    const [error, setError] = useState(null);
    const [numClusters, setNumClusters] = useState(DEFAULT_NUM_CLUSTERS);

    useEffect(() => {
        const savedClusters = StorageUtils.getItem(LS_CLUSTERS);
        const savedEmailClusters = StorageUtils.getItem(LS_EMAIL_CLUSTERS);
        setClusters(savedClusters || []);
        setEmailClusters(savedEmailClusters || []);
    }, []);

    const handleRunKmeans = async () => {
        if (activeAction) {
            return;
        }
        setActiveAction(ACTION.KMEANS);
        setClusters([]);
        setError("");

        try {
            const res = await axios.post("/api/run-kmeans", {
                numClusters,
            });
            setClusters(res.data.clusters);
            setEmailClusters(res.data.email_clusters);
            StorageUtils.setItem(LS_CLUSTERS, res.data.clusters);
            StorageUtils.setItem(LS_EMAIL_CLUSTERS, res.data.email_clusters);
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        } finally {
            setActiveAction(null);
        }
    };

    return (
        <>
            <Flex>
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={!activeAction}
                    height={DIMENS.HEADER_SECTION_HEIGHT}
                    hoverBackground={
                        activeAction ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    onClick={handleRunKmeans}
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    style={{ flex: 1 }}
                    width={DIMENS.HEADER_SECTION_HEIGHT}
                >
                    <Icon
                        color={
                            activeAction ? COLORS.GRAY_MEDIUM : COLORS.BLUE_DARK
                        }
                        name={ICON.RUN}
                        size={26}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text center fontSize={FONT_SIZE.S}>
                        {activeAction === ACTION.KMEANS ? "Running" : "Run"}
                    </Text>
                </Box>
                <Box style={{ flex: 1 }}>
                    <Select
                        disabled={activeAction}
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
            <Text fontSize={FONT_SIZE.XS}>Run K-means</Text>
        </>
    );
};

export default KMeansActions;
