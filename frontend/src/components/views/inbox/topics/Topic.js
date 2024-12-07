import React from "react";

import { Icon } from "../../../common";
import { ALL_TOPICS } from "../../../../res";
import { ICON } from "../../../../res/icons";
import {
    Box,
    COLORS,
    DIMENS,
    Flex,
    FONT_SIZE,
    Text,
    TextEllipsis,
} from "../../../../styles";

const Topic = ({ id, title, onClick, selectedTopic, size }) => {
    const isAll = title === ALL_TOPICS;
    const isSelected = id === selectedTopic;
    const disabled = !title;

    const handleClick = () => {
        if (!disabled) {
            onClick();
        }
    };

    return (
        <Box
            background={isSelected ? COLORS.BLUE_LIGHT : COLORS.TRANSPARENT}
            borderRadius={DIMENS.BORDER_RADIUS_L}
            clickable={!disabled}
            margin={{ bottom: 1, right: 5, top: 1 }}
            onClick={handleClick}
            padding={{ bottom: 4, left: 15, right: 10, top: 4 }}
            style={{ userSelect: "none" }}
            width="100%"
        >
            <Flex justifyContent="space-between">
                <Flex style={{ marginRight: "5px" }}>
                    <Icon
                        disabled={disabled}
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
                    <TextEllipsis
                        bold={isSelected}
                        disabled={disabled}
                        style={{ textTransform: "capitalize" }}
                    >
                        {title || "Empty"}
                    </TextEllipsis>
                </Flex>
                <Text color={COLORS.GRAY_DARK}>{size}</Text>
            </Flex>
        </Box>
    );
};

export default Topic;
