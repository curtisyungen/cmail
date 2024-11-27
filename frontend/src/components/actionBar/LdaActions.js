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

const DEFAULT_NO_ABOVE = 50; // %
const DEFAULT_NO_BELOW = 2;
const DEFAULT_NUM_TOPICS = 10;
const MAX_NO_ABOVE = 10; // will be * 10
const MAX_NO_BELOW = 6;
const MAX_NUM_TOPICS = 20;

const LdaActions = ({
    activeAction,
    setActiveAction,
    setEmailTopics,
    setTopics,
}) => {
    const [error, setError] = useState(null);
    const [noBelow, setNoBelow] = useState(DEFAULT_NO_BELOW);
    const [noAbove, setNoAbove] = useState(DEFAULT_NO_ABOVE);
    const [numTopics, setNumTopics] = useState(DEFAULT_NUM_TOPICS);

    const generateTopicLabels = (topics) => {
        try {
            const labels = {};
            topics.forEach(([_, topic], index) => {
                const topWords = topic
                    .split(" + ")
                    .map((term) => term.split("*")[1].replace(/"/g, "").trim());
                labels[parseInt(index)] = topWords.slice(0, 5).join(", ");
            });
            return labels;
        } catch (e) {
            console.log("Error generating topic labels: ", e);
            return null;
        }
    };

    const handleRunLDA = async () => {
        if (activeAction) {
            return;
        }
        setActiveAction(ACTION.LDA);
        try {
            const res = await axios.post("/api/run-lda", {
                numTopics,
                noBelow,
                noAbove: noAbove / 100,
            });
            console.log("response: ", res.data);
            const { email_assignments, dominant_topics, topics } = res.data;
            setEmailTopics(email_assignments);
            setTopics(generateTopicLabels(topics));
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
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        activeAction ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    onClick={handleRunLDA}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
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
                        {activeAction === ACTION.LDA ? "Running" : "Run"}
                    </Text>
                </Box>
                <Box margin={{ right: 5 }} style={{ flex: 1 }}>
                    <Select
                        disabled={activeAction}
                        onChange={(e) => setNumTopics(parseInt(e.target.value))}
                        style={{
                            marginBottom: "5px",
                        }}
                        value={numTopics}
                        width={DIMENS.SELECT_WIDTH}
                    >
                        {Array.from(
                            { length: MAX_NUM_TOPICS },
                            (_, index) => index + 1
                        ).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </Select>
                    <Text center fontSize={FONT_SIZE.S}>
                        No. Topics
                    </Text>
                </Box>
                <Box margin={{ right: 5 }} style={{ flex: 1 }}>
                    <Select
                        disabled={activeAction}
                        onChange={(e) => setNoBelow(parseInt(e.target.value))}
                        style={{
                            marginBottom: "5px",
                        }}
                        value={noBelow}
                        width={DIMENS.SELECT_WIDTH}
                    >
                        {Array.from(
                            { length: MAX_NO_BELOW },
                            (_, index) => index
                        ).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </Select>
                    <Text center fontSize={FONT_SIZE.S}>
                        Min. Freq.
                    </Text>
                </Box>
                <Box style={{ flex: 1 }}>
                    <Select
                        disabled={activeAction}
                        onChange={(e) => setNoAbove(parseFloat(e.target.value))}
                        style={{
                            marginBottom: "5px",
                        }}
                        value={noAbove}
                        width={DIMENS.SELECT_WIDTH}
                    >
                        {Array.from(
                            { length: MAX_NO_ABOVE },
                            (_, index) => (index + 1) * 10
                        ).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </Select>
                    <Text center fontSize={FONT_SIZE.S}>
                        Max. Freq. (%)
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Latent Dirichlet Allocation</Text>
        </>
    );
};

export default LdaActions;
