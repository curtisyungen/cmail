import React from "react";

import { ALL_TOPICS } from "../../res";
import { Box, Flex, Text } from "../../styles";
import COLORS from "../../styles/Colors";

const Topic = ({ id, title, onClick, selectedTopic, size }) => {
    const isSelected = id === selectedTopic;

    return (
        <Box
            background={isSelected ? COLORS.BLUE_LIGHT : COLORS.TRANSPARENT}
            borderRadius={5}
            clickable={true}
            margin={1}
            onClick={onClick}
            padding={{ bottom: 3, left: 20, right: 5, top: 3 }}
            style={{ userSelect: "none" }}
            width={150}
        >
            <Flex justifyContent="space-between">
                <Text bold={isSelected} style={{ textTransform: "capitalize" }}>
                    {title === ALL_TOPICS ? ALL_TOPICS : title}
                </Text>
                <Text color={COLORS.GRAY_DARK}>{size}</Text>
            </Flex>
        </Box>
    );
};

export default Topic;
