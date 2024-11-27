import React, { useEffect, useState } from "react";
import axios from "axios";

import { Icon } from "./common";
import { ACTION } from "../res";
import { ICON } from "../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Select, Text } from "../styles";
import { StorageUtils } from "../utils";

const DEFAULT_EMAIL_COUNT = 100;
const DEFAULT_NUM_CLUSTERS = 12;
const LS_CLUSTERS = "clusters";
const LS_EMAIL_CLUSTERS = "email_clusters";
const SECTION_HEIGHT = DIMENS.HEADER_HEIGHT - 30;
const SELECT_WIDTH = "80px";

const Divider = () => {
    return (
        <Box
            background={COLORS.BORDER}
            height={DIMENS.HEADER_HEIGHT - 10}
            margin={{ left: 5, right: 5 }}
            width={1}
        />
    );
};

const Section = ({ children }) => {
    return (
        <Box
            alignItems="center"
            height={SECTION_HEIGHT}
            padding={5}
            width="fit-content"
        >
            {children}
        </Box>
    );
};

const Header = ({
    activeAction,
    setClusters,
    setEmailClusters,
    setActiveAction,
}) => {
    const [emailCount, setEmailCount] = useState(DEFAULT_EMAIL_COUNT);
    const [error, setError] = useState("");
    const [numClusters, setNumClusters] = useState(DEFAULT_NUM_CLUSTERS);

    const emailCountOptions = Array.from(
        { length: 10 },
        (_, i) => (i + 1) * 100
    );

    useEffect(() => {
        const savedClusters = StorageUtils.getItem(LS_CLUSTERS);
        const savedEmailClusters = StorageUtils.getItem(LS_EMAIL_CLUSTERS);
        setClusters(savedClusters || []);
        setEmailClusters(savedEmailClusters || []);
    }, []);

    const handleGenerate = async () => {
        if (activeAction) {
            return;
        }
        setActiveAction(ACTION.GENERATE);
        try {
            const res = await axios.post("/api/generate-data", {
                emailCount,
            });
            console.log("response: ", res.data);
        } catch (e) {
            console.log("Error generating data: ", e);
        } finally {
            setActiveAction(null);
        }
    };

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

    const handleRunLDA = async () => {
        if (activeAction) {
            return;
        }
        setActiveAction(ACTION.LDA);
        try {
            const res = await axios.post("/api/run-lda");
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        } finally {
            setActiveAction(null);
        }
    };

    return (
        <Box
            background={COLORS.WHITE}
            borderRadius={5}
            height={DIMENS.HEADER_HEIGHT}
            padding={{ left: 5 }}
        >
            <Flex>
                <Section>
                    <Flex>
                        <Box
                            alignItems="center"
                            borderRadius={5}
                            clickable={!activeAction}
                            height={SECTION_HEIGHT}
                            hoverBackground={
                                activeAction
                                    ? COLORS.TRANSPARENT
                                    : COLORS.GRAY_LIGHT
                            }
                            onClick={handleRunKmeans}
                            margin={{ right: DIMENS.SPACING_STANDARD }}
                            style={{ flex: 1 }}
                            width={SECTION_HEIGHT}
                        >
                            <Icon
                                color={
                                    activeAction
                                        ? COLORS.GRAY_MEDIUM
                                        : COLORS.BLUE_DARK
                                }
                                name={ICON.RUN}
                                size={26}
                                style={{ marginBottom: "5px" }}
                            />
                            <Text center fontSize={FONT_SIZE.S}>
                                {activeAction === ACTION.KMEANS
                                    ? "Running"
                                    : "Run"}
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
                                    width: SELECT_WIDTH,
                                }}
                                value={numClusters}
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
                </Section>
                <Divider />
                <Section>
                    <Flex>
                        <Box
                            alignItems="center"
                            borderRadius={5}
                            clickable={!activeAction}
                            height={SECTION_HEIGHT}
                            hoverBackground={
                                activeAction
                                    ? COLORS.TRANSPARENT
                                    : COLORS.GRAY_LIGHT
                            }
                            onClick={handleRunLDA}
                            style={{ flex: 1 }}
                            width={SECTION_HEIGHT}
                        >
                            <Icon
                                color={
                                    activeAction
                                        ? COLORS.GRAY_MEDIUM
                                        : COLORS.BLUE_DARK
                                }
                                name={ICON.RUN}
                                size={26}
                                style={{ marginBottom: "5px" }}
                            />
                            <Text center fontSize={FONT_SIZE.S}>
                                {activeAction === ACTION.LDA
                                    ? "Running"
                                    : "Run"}
                            </Text>
                        </Box>
                    </Flex>
                    <Text fontSize={FONT_SIZE.XS}>Run LDA</Text>
                </Section>
                <Divider />
                <Section>
                    <Flex>
                        <Box
                            alignItems="center"
                            borderRadius={5}
                            clickable={!activeAction}
                            height={SECTION_HEIGHT}
                            hoverBackground={
                                activeAction
                                    ? COLORS.TRANSPARENT
                                    : COLORS.GRAY_LIGHT
                            }
                            margin={{ right: DIMENS.SPACING_STANDARD }}
                            onClick={handleGenerate}
                            style={{ flex: 1 }}
                            width={SECTION_HEIGHT}
                        >
                            <Icon
                                color={
                                    activeAction
                                        ? COLORS.GRAY_MEDIUM
                                        : COLORS.BLUE_DARK
                                }
                                name={ICON.GENERATE}
                                size={24}
                                style={{ marginBottom: "5px" }}
                            />
                            <Text center fontSize={FONT_SIZE.S}>
                                {activeAction === ACTION.GENERATE
                                    ? "Generating"
                                    : "Generate"}
                            </Text>
                        </Box>
                        <Box style={{ flex: 1 }}>
                            <Select
                                disabled={activeAction}
                                onChange={(e) =>
                                    setEmailCount(parseInt(e.target.value))
                                }
                                style={{
                                    marginBottom: "5px",
                                    width: SELECT_WIDTH,
                                }}
                                value={emailCount}
                            >
                                {emailCountOptions.map((count) => (
                                    <option key={count} value={count}>
                                        {count}
                                    </option>
                                ))}
                            </Select>
                            <Text center fontSize={FONT_SIZE.S}>
                                No. Emails
                            </Text>
                        </Box>
                    </Flex>
                    <Text fontSize={FONT_SIZE.XS}>Data</Text>
                </Section>
            </Flex>
        </Box>
    );
};

export default Header;
