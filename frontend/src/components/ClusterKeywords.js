import React, { useEffect, useState } from "react";

import { Box, Text } from "../styles";
import SortUtils from "../utils/SortUtils";

const ClusterKeywords = ({ title, keywords = [] }) => {
    const [maxFrequency, setMaxFrequency] = useState(0);
    const [sortedKeywords, setSortedKeywords] = useState([]);

    useEffect(() => {
        const sortedKeywords = SortUtils.sortData({ data: keywords });
        let maxFrequency = 0;
        for (let i = 0; i < sortedKeywords.length; i++) {
            const [_, frequency] = sortedKeywords[i];
            if (frequency > maxFrequency) {
                maxFrequency = frequency;
            }
        }
        setMaxFrequency(maxFrequency);
        setSortedKeywords(sortedKeywords);
    }, [keywords]);

    return (
        <Box>
            <Text bold>Cluster {title}</Text>
            <Box>
                {sortedKeywords.map(([word, frequency], idx) => (
                    <Text
                        key={idx}
                        bold={frequency === maxFrequency}
                    >{`${word}: ${frequency}`}</Text>
                ))}
            </Box>
        </Box>
    );
};

export default ClusterKeywords;
