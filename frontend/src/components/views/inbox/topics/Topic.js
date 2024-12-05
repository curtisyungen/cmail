import React from "react";

import { Icon } from "../../../common";
import { ALL_TOPICS } from "../../../../res";
import { ICON } from "../../../../res/icons";
import { Box, COLORS, Flex, FONT_SIZE, Text } from "../../../../styles";

const Topic = ({ id, title, onClick, selectedTopic, size }) => {
    const isAll = title === ALL_TOPICS;
    const isSelected = id === selectedTopic;

    return (
        <Box
            background={isSelected ? COLORS.BLUE_LIGHT : COLORS.TRANSPARENT}
            borderRadius={5}
            clickable={true}
            margin={1}
            onClick={onClick}
            padding={{ bottom: 4, left: 15, right: 5, top: 4 }}
            style={{ userSelect: "none" }}
            width={150}
        >
            <Flex justifyContent="space-between">
                <Flex>
                    <Icon
                        name={
                            isAll
                                ? ICON.INBOX
                                : isSelected
                                ? ICON.FOLDER
                                : ICON.FOLDER_REG
                        }
                        size={FONT_SIZE.M}
                        style={{ marginRight: "8px", width: "12px" }}
                    />
                    <Text
                        bold={isSelected}
                        style={{ textTransform: "capitalize" }}
                    >
                        {title === ALL_TOPICS ? ALL_TOPICS : title}
                    </Text>
                </Flex>
                <Text color={COLORS.GRAY_DARK}>{size}</Text>
            </Flex>
        </Box>
    );
};

export default Topic;
