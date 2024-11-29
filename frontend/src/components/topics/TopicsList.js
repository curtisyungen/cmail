import React, { useEffect, useState } from "react";

import Topic from "./Topic";
import { ALL_TOPICS } from "../../res";
import { Box } from "../../styles";
import DIMENS from "../../styles/Dimens";

const TopicsList = ({ selectedTopic, setSelectedTopic, topicsMap, topics }) => {
    const [topicTotals, setTopicTotals] = useState({});

    useEffect(() => {
        calculateTopicTotals();
    }, [topicsMap]);

    const calculateTopicTotals = () => {
        if (!topicsMap) {
            return;
        }
        const totals = {};
        let totalEmails = 0;
        for (const { cluster_id } of topicsMap) {
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
        setSelectedTopic(selectedTopic === topic ? ALL_TOPICS : topic);
    };

    return (
        <Box
            margin={{ right: DIMENS.SPACING_STANDARD }}
            padding={{ left: 10 }}
            width="fit-content"
        >
            <Topic
                id={ALL_TOPICS}
                title={ALL_TOPICS}
                onClick={() => handleTopicClick(ALL_TOPICS)}
                selectedTopic={selectedTopic}
                size={topicTotals[ALL_TOPICS]}
            />
            {topics.map(({ category, topic_id }, idx) => (
                <Topic
                    key={idx}
                    id={topic_id}
                    title={category}
                    onClick={() => handleTopicClick(topic_id)}
                    selectedTopic={selectedTopic}
                    size={topicTotals[topic_id]}
                />
            ))}
        </Box>
    );
};

export default TopicsList;
