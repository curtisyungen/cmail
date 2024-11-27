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
        for (const topic of Object.values(topicsMap)) {
            if (!totals[topic]) {
                totals[topic] = 0;
            }
            totals[topic] += 1;
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
                title={ALL_TOPICS}
                keywords={[]}
                onClick={() => handleTopicClick(ALL_TOPICS)}
                selectedTopic={selectedTopic}
                size={topicTotals[ALL_TOPICS]}
            />
            {Object.entries(topics).map(([_, keywords], idx) => (
                <Topic
                    key={idx}
                    title={idx}
                    keywords={keywords}
                    onClick={handleTopicClick}
                    selectedTopic={selectedTopic}
                    size={topicTotals[idx]}
                />
            ))}
        </Box>
    );
};

export default TopicsList;
