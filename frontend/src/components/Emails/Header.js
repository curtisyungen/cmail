import React from "react";

import { ALL_TOPICS } from "../../res";
import { Box, COLORS, Flex, Text } from "../../styles";

const Header = ({ selectedTopic, topics = [] }) => {
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
            <Text bold>Cluster Keywords</Text>
            <Box margin={{ top: 5 }}>
                <Flex flexWrap={true}>
                    <Text capitalize>
                        {topics
                            .find(({ topic_id }) => topic_id === selectedTopic)
                            ?.keywords.map(({ word }) => word)
                            .join(", ")}
                    </Text>
                </Flex>
            </Box>
        </Box>
    );
};

export default Header;
