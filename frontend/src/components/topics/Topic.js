import React, { useEffect, useState } from "react";

import { ALL_TOPICS } from "../../res";
import { Box, Flex, Text } from "../../styles";
import COLORS from "../../styles/Colors";
import SortUtils from "../../utils/SortUtils";

const Topic = ({ title, keywords = [], onClick, selectedTopic, size }) => {
    const [expanded, setExpanded] = useState(false);
    const [maxFrequency, setMaxFrequency] = useState(0);
    const [sortedKeywords, setSortedKeywords] = useState([]);

    const isSelected = title === selectedTopic;

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
            padding={{ bottom: 3, left: 20, right: 5, top: 3 }}
            width={150}
        >
            <Flex justifyContent="space-between">
                <Text bold={isSelected}>
                    {title === ALL_TOPICS ? ALL_TOPICS : title}
                </Text>
                <Text color={COLORS.GRAY_DARK}>{size}</Text>
            </Flex>
        </Box>
    );
};

export default Topic;
