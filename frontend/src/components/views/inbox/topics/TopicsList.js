import React, { useEffect, useState } from "react";

import Topic from "./Topic";
import { useAppActions, useAppContext } from "../../hooks";
import { ALL_TOPICS } from "../../res";
import { Box, DIMENS, FONT_SIZE, Text } from "../../styles";
import { SortUtils } from "../../utils";

const TopicsList = () => {
    const { setSelectedEmail, setSelectedTopic } = useAppActions();
    const { emails, selectedTopic, topics, topicsMap } = useAppContext();

    const [groupedTopics, setGroupedTopics] = useState({
        generated: [],
        custom: [],
    });
    const [topicTotals, setTopicTotals] = useState({});

    useEffect(() => {
        setTopicTotals({
            ...topicTotals,
            [ALL_TOPICS]: emails.length,
        });
    }, [emails]);

    useEffect(() => {
        sortTopics();
    }, [topics]);

    useEffect(() => {
        calculateTopicTotals();
    }, [topicsMap]);

    const calculateTopicTotals = () => {
        if (!topicsMap) {
            return;
        }
        const totals = {};
        let totalEmails = 0;
        for (const { cluster_id } of Object.values(topicsMap)) {
            if (!totals[cluster_id]) {
                totals[cluster_id] = 0;
            }
            totals[cluster_id] += 1;
            totalEmails += 1;
        }
        totals[ALL_TOPICS] = totalEmails;
        setTopicTotals(totals);
    };

    const handleTopicClick = (topic) => {
        setSelectedEmail(null);
        setSelectedTopic(selectedTopic === topic ? ALL_TOPICS : topic);
    };

    const sortTopics = () => {
        const sortedTopics = SortUtils.sortData({
            data: topics || [],
            key: "label",
        });
        const groupedTopics = {
            custom: [],
            generated: [],
        };
        for (const topic of sortedTopics) {
            if (topic.generated) {
                groupedTopics.generated.push(topic);
            } else {
                groupedTopics.custom.push(topic);
            }
        }
        setGroupedTopics(groupedTopics);
    };

    return (
        <Box
            height={DIMENS.EMAIL_LIST_HEIGHT}
            justifyContent="flex-start"
            margin={{ right: DIMENS.SPACING_STANDARD }}
            padding={{ left: 10 }}
            style={{ minWidth: "fit-content", overflowY: "scroll" }}
            width="fit-content"
        >
            <Box margin={{ bottom: 3, top: 3 }}>
                <Text bold fontSize={FONT_SIZE.M}>
                    Custom
                </Text>
            </Box>
            <Topic
                id={ALL_TOPICS}
                title={ALL_TOPICS}
                onClick={() => handleTopicClick(ALL_TOPICS)}
                selectedTopic={selectedTopic}
                size={topicTotals[ALL_TOPICS]}
            />
            {groupedTopics.custom.map(({ label, topic_id }, idx) => (
                <Topic
                    key={idx}
                    id={topic_id}
                    title={label}
                    onClick={() => handleTopicClick(topic_id)}
                    selectedTopic={selectedTopic}
                    size={topicTotals[topic_id]}
                />
            ))}
            {groupedTopics?.generated?.length > 0 ? (
                <>
                    <Box margin={{ bottom: 3, top: 3 }}>
                        <Text bold fontSize={FONT_SIZE.M}>
                            Generated
                        </Text>
                    </Box>
                    {groupedTopics.generated.map(({ label, topic_id }, idx) => (
                        <Topic
                            key={idx}
                            id={topic_id}
                            title={label}
                            onClick={() => handleTopicClick(topic_id)}
                            selectedTopic={selectedTopic}
                            size={topicTotals[topic_id]}
                        />
                    ))}
                </>
            ) : (
                <></>
            )}
        </Box>
    );
};

export default TopicsList;
