import React, { useEffect, useState } from "react";

import { ALL_CLUSTERS } from "../../res";
import { Box, Text } from "../../styles";
import COLORS from "../../styles/Colors";
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
            background={isSelected ? COLORS.BLUE_LIGHT : COLORS.TRANSPARENT}
            borderRadius={5}
            clickable={true}
            margin={1}
            onClick={() => onClick(title)}
            padding={{ bottom: 3, left: 20, top: 3 }}
            width={150}
        >
            <Text bold={isSelected}>
                {title === ALL_CLUSTERS ? ALL_CLUSTERS : `Cluster ${title}`}
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
