import { useEffect, useState } from "react";
import useAppContext from "./useAppContext";

const useKeywords = () => {
    const { selectedTopic, topics } = useAppContext();

    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        console.log("topics: ", topics);
        const keywords = topics.find(
            ({ topic_id }) => topic_id === selectedTopic
        )?.keywords;
        console.log("keywords: ", keywords);
        setKeywords(keywords || []);
    }, [selectedTopic, topics]);

    return {
        keywords: keywords.map(({ word }) => word),
        keywordsWithWeights: keywords,
    };
};

export default useKeywords;
