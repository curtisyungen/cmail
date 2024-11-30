import { useEffect, useState } from "react";
import useAppContext from "./useAppContext";

const useKeywords = () => {
    const { selectedTopic, topics } = useAppContext();

    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        const keywords = topics
            .find(({ topic_id }) => topic_id === selectedTopic)
            ?.keywords.map(({ word }) => word);
        console.log("keywords: ", keywords);
        console.log("topics: ", topics);
        console.log("selectedTopic: ", selectedTopic);
        setKeywords(keywords);
    }, [selectedTopic, topics]);

    return {
        keywords,
    };
};

export default useKeywords;
