import React, { useEffect, useState } from "react";

import Topic from "./Topic";
import TopicsListSection from "./TopicsListSection";
import { useAppActions, useAppContext } from "../../../../hooks";
import { ALL_TOPICS } from "../../../../res";
import { Box, DIMENS } from "../../../../styles";
import { SortUtils } from "../../../../utils";

const TopicsList = () => {
    const { setSelectedEmail, setSelectedTopic } = useAppActions();
    const {
        emails,
        emailToTopicIdMap,
        selectedTopic,
        showNavigationPane,
        topics,
    } = useAppContext();

    const [groupedTopics, setGroupedTopics] = useState({
        generated: [],
        custom: [],
    });
    const [topicTotals, setTopicTotals] = useState({});

    useEffect(() => {
        setTopicTotals({
            ...topicTotals,
            [ALL_TOPICS]: emails?.length,
        });
    }, [emails]);

    useEffect(() => {
        sortTopics();
    }, [topics]);

    useEffect(() => {
        calculateTopicTotals();
    }, [emailToTopicIdMap]);

    const calculateTopicTotals = () => {
        if (!emailToTopicIdMap) {
            return;
        }
        const totals = {};
        let totalEmails = 0;
        for (const clusterId of Object.values(emailToTopicIdMap)) {
            if (!totals[clusterId]) {
                totals[clusterId] = 0;
            }
            totals[clusterId] += 1;
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

    if (!showNavigationPane) {
        return null;
    }

    return (
        <Box
            height={DIMENS.EMAIL_LIST_HEIGHT}
            justifyContent="flex-start"
            margin={{ right: DIMENS.SPACING_STANDARD }}
            padding={{ left: 10, right: 5 }}
            style={{
                maxWidth: `${DIMENS.TOPICS_LIST_WIDTH}px`,
                minWidth: DIMENS.TOPICS_LIST_WIDTH,
                overflowY: "scroll",
                scrollbarWidth: "none",
            }}
            width={DIMENS.TOPICS_LIST_WIDTH}
        >
            <TopicsListSection title="Custom">
                <Topic
                    id={ALL_TOPICS}
                    title={ALL_TOPICS}
                    onClick={handleTopicClick}
                    selectedTopic={selectedTopic}
                    subtopics={[]}
                    topicTotals={topicTotals}
                />
                {groupedTopics.custom.map(
                    ({ label, subtopics, topic_id }, idx) => (
                        <Topic
                            key={idx}
                            id={topic_id}
                            title={label}
                            onClick={handleTopicClick}
                            selectedTopic={selectedTopic}
                            subtopics={subtopics}
                            topicTotals={topicTotals}
                        />
                    )
                )}
            </TopicsListSection>
            <TopicsListSection title="Generated">
                {groupedTopics.generated.map(
                    ({ label, subtopics, topic_id }, idx) => (
                        <Topic
                            key={idx}
                            id={topic_id}
                            title={label}
                            onClick={handleTopicClick}
                            selectedTopic={selectedTopic}
                            subtopics={subtopics}
                            topicTotals={topicTotals}
                        />
                    )
                )}
            </TopicsListSection>
        </Box>
    );
};

export default TopicsList;
