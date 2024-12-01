import React from "react";

import { useAppContext, useKeywords } from "../../hooks";
import { ALL_TOPICS } from "../../res";
import { Box, COLORS, Flex, FONT_SIZE, Text } from "../../styles";

const Header = () => {
    const { selectedTopic, topics } = useAppContext();
    const { keywordsWithWeights } = useKeywords();

    if (selectedTopic === ALL_TOPICS || topics.length === 0) {
        return null;
    }

    return (
        <Box
            background={COLORS.GRAY_LIGHT}
            padding={10}
            style={{
                borderBottomWidth: 1,
                borderColor: COLORS.BORDER,
                userSelect: "none",
            }}
        >
            <Text bold>Top Keywords</Text>
            <Box margin={{ top: 5 }}>
                <Flex flexWrap={true}>
                    <Text capitalize fontSize={FONT_SIZE.S}>
                        {keywordsWithWeights
                            .reduce((array, { weight, word }) => {
                                array.push(`${word}`);
                                return array;
                            }, [])
                            .join(", ")}
                    </Text>
                </Flex>
            </Box>
        </Box>
    );
};

export default Header;
