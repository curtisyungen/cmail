import React, { useEffect, useState } from "react";

import Topic from "./Topic";
import { useAppActions, useAppContext } from "../../hooks";
import { ALL_TOPICS } from "../../res";
import { Box } from "../../styles";
import DIMENS from "../../styles/Dimens";
import { SortUtils } from "../../utils";

const TopicsList = () => {
    const { setSelectedEmail, setSelectedTopic } = useAppActions();
    const { selectedTopic, topics, topicsMap } = useAppContext();

    const [sortedTopics, setSortedTopics] = useState([]);

    useEffect(() => {
        console.log("topics: ", topics);
        sortTopics();
    }, [topics]);

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
            data: topics.flat(),
            key: "label",
        });
        console.log("sortedTopics: ", sortedTopics);
        setSortedTopics(sortedTopics);
    };

    return (
        <Box
            height={DIMENS.EMAIL_LIST_HEIGHT}
            justifyContent="flex-start"
            margin={{ right: DIMENS.SPACING_STANDARD }}
            padding={{ left: 10 }}
            style={{ overflowY: "scroll" }}
            width="fit-content"
        >
            <Topic
                id={ALL_TOPICS}
                title={ALL_TOPICS}
                onClick={() => handleTopicClick(ALL_TOPICS)}
                selectedTopic={selectedTopic}
                size={topicTotals[ALL_TOPICS]}
            />
            {sortedTopics.map(({ label, topic_id }, idx) => (
                <Topic
                    key={idx}
                    id={topic_id}
                    title={label}
                    onClick={() => handleTopicClick(topic_id)}
                    selectedTopic={selectedTopic}
                    size={topicTotals[topic_id]}
                />
            ))}
        </Box>
    );
};

export default TopicsList;
