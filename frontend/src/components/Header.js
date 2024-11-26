import React, { useEffect, useState } from "react";
import axios from "axios";

import { ClusterViewer } from "./Clusters";
import { Box, Button, Flex, Select, Text } from "../styles";
import COLORS from "../styles/Colors";
import DIMENS from "../styles/Dimens";
import { StorageUtils } from "../utils";

const DEFAULT_EMAIL_COUNT = 100;
const DEFAULT_NUM_CLUSTERS = 12;
const LS_CLUSTERS = "clusters";
const LS_EMAIL_CLUSTERS = "email_clusters";
const SECTION_HEIGHT = DIMENS.HEADER_HEIGHT - 10;

const Divider = () => {
    return (
        <Box
            background={COLORS.GRAY_LIGHT}
            height={SECTION_HEIGHT}
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
            width={100}
        >
            {children}
        </Box>
    );
};

const Header = ({
    clusters,
    loading,
    selectedCluster,
    setClusters,
    setEmailClusters,
    setLoading,
    setSelectedCluster,
}) => {
    const [emailCount, setEmailCount] = useState(DEFAULT_EMAIL_COUNT);
    const [error, setError] = useState("");
    const [generate, setGenerate] = useState(false);
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

    const handleSubmit = async () => {
        setLoading(true);
        setClusters([]);
        setError("");

        try {
            const res = await axios.post("/api/run-model", {
                generate,
                emailCount,
                numClusters,
            });
            setClusters(res.data.clusters);
            setEmailClusters(res.data.email_clusters);
            StorageUtils.setItem(LS_CLUSTERS, res.data.clusters);
            StorageUtils.setItem(LS_EMAIL_CLUSTERS, res.data.email_clusters);
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            background={COLORS.WHITE}
            borderRadius={5}
            height={DIMENS.HEADER_HEIGHT}
        >
            <Flex>
                <Section>
                    <Select
                        value={numClusters}
                        onChange={(e) =>
                            setNumClusters(parseInt(e.target.value))
                        }
                        style={{ width: "100%" }}
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
                    <Text>Clusters</Text>
                </Section>
                <Divider />
                <Section>
                    <Select
                        value={emailCount}
                        onChange={(e) =>
                            setEmailCount(parseInt(e.target.value))
                        }
                        style={{ width: "100%" }}
                    >
                        {emailCountOptions.map((count) => (
                            <option key={count} value={count}>
                                {count}
                            </option>
                        ))}
                    </Select>
                    <Text>Emails</Text>
                </Section>
                <Divider />
                <Section>
                    <input
                        type="checkbox"
                        checked={generate}
                        onChange={(e) => setGenerate(e.target.checked)}
                        style={{ height: 25, width: 25 }}
                    />
                    <Text center>Generate New Data</Text>
                </Section>
                <Divider />
                <Section>
                    <Button onClick={handleSubmit}>Execute</Button>
                </Section>
                <Divider />
                <ClusterViewer
                    clusters={clusters}
                    selectedCluster={selectedCluster}
                    setSelectedCluster={setSelectedCluster}
                />
            </Flex>
        </Box>
    );
};

export default Header;
