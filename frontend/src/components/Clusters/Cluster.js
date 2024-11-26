import React, { useEffect, useState } from "react";

import { Box, Text } from "../../styles";
import SortUtils from "../../utils/SortUtils";

const Cluster = ({ title, keywords = [], onClick, selectedCluster }) => {
    const [expanded, setExpanded] = useState(false);
    const [maxFrequency, setMaxFrequency] = useState(0);
    const [sortedKeywords, setSortedKeywords] = useState([]);

    const isSelected = title === selectedCluster;

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
        <Box
            borderWidth={1}
            clickable={true}
            height={20}
            margin={1}
            onClick={() => onClick(title)}
            width={20}
        >
            <Text bold={isSelected} center={true}>
                {title}
            </Text>
            {expanded &&
                sortedKeywords.map(([word, frequency], idx) => (
                    <Text
                        key={idx}
                        bold={frequency === maxFrequency}
                    >{`${word}: ${frequency}`}</Text>
                ))}
        </Box>
    );
};

export default Cluster;
