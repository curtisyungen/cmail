import React, { useEffect, useState } from "react";
import axios from "axios";

import { Icon } from "../common";
import { ACTION } from "../../res";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";

const LdaActions = ({ activeAction, setActiveAction }) => {
    const [error, setError] = useState(null);

    const groupEmailsByTopic = (emailAssignments, dominantTopics) => {
        const topicGroups = {};
        emailAssignments.forEach((assignedTopics, index) => {
            assignedTopics.forEach((topic) => {
                if (!topicGroups[topic]) {
                    topicGroups[topic] = [];
                }
                topicGroups[topic].push({
                    emailIndex: index,
                    dominantTopic: dominantTopics[index],
                });
            });
        });
        console.log("topicGroups: ", topicGroups);
    };

    const handleRunLDA = async () => {
        if (activeAction) {
            return;
        }
        setActiveAction(ACTION.LDA);
        try {
            const res = await axios.post("/api/run-lda");
            const { email_assignments, dominant_topics } = res.data;
            groupEmailsByTopic(email_assignments, dominant_topics);
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
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Run LDA</Text>
        </>
    );
};

export default LdaActions;
