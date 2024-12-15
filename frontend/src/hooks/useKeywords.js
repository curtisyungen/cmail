import { useEffect, useState } from "react";
import useAppContext from "./useAppContext";

const useKeywords = () => {
    const { selectedTopic, topics } = useAppContext();

    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        setKeywords(getKeywords());
    }, [selectedTopic, topics]);

    const getKeywords = () => {
        for (const { keywords, subtopics, topic_id } of topics) {
            if (topic_id === selectedTopic) {
                return keywords;
            }
            for (const subtopic of subtopics) {
                if (subtopic.topic_id === selectedTopic) {
                    return subtopic.keywords;
                }
            }
        }
        return [];
    };

    return {
        keywords: keywords.map(({ word }) => word),
        keywordsWithWeights: keywords,
    };
};

export default useKeywords;
