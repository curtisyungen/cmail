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
        for (const topic of Object.keys(topics)) {
            if (!totals[topic]) {
                totals[topic] = 0;
            }
            for (const topicsList of topicsMap) {
                if (topicsList.includes(parseInt(topic))) {
                    totals[topic] += 1;
                }
            }
        }
        setTopicTotals(totals);
    };

    const handleTopicClick = (topic) => {
        setSelectedTopic(
            selectedTopic === topic ? ALL_TOPICS : parseInt(topic)
        );
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
            {Object.entries(topics).map(([id, words], idx) => (
                <Topic
                    key={id}
                    id={parseInt(id)}
                    title={words}
                    onClick={() => handleTopicClick(id)}
                    selectedTopic={selectedTopic}
                    size={topicTotals[idx]}
                />
            ))}
        </Box>
    );
};

export default TopicsList;
