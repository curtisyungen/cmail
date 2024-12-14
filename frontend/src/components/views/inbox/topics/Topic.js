import React, { useState } from "react";

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

const Topic = ({
    id,
    title,
    isSubtopic,
    onClick,
    selectedTopic,
    subtopics = [],
    topicTotals,
}) => {
    const [expanded, setExpanded] = useState(false);

    const isAll = title === ALL_TOPICS;
    const isSelected = id === selectedTopic;
    const disabled = !title;
    const size = topicTotals[id] || 0;

    const handleClick = () => {
        if (disabled) {
            return;
        }
        if (subtopics.length > 0) {
            setExpanded(!expanded);
            return;
        }
        onClick(id);
    };

    return (
        <>
            <Box
                background={isSelected ? COLORS.BLUE_LIGHT : COLORS.TRANSPARENT}
                borderRadius={DIMENS.BORDER_RADIUS_L}
                clickable={!disabled}
                hoverBackground={
                    isSelected ? COLORS.BLUE_LIGHT : COLORS.GRAY_MEDIUM2
                }
                margin={{
                    right: 5,
                }}
                onClick={handleClick}
                padding={{ bottom: 5, left: 10, right: 10, top: 5 }}
                style={{ userSelect: "none" }}
            >
                <Flex justifyContent="space-between">
                    <Flex style={{ marginRight: "5px" }}>
                        {isSubtopic ? <Box height={10} width={10} /> : <></>}
                        <Box
                            clickable
                            onClick={() => setExpanded(!expanded)}
                            width={15}
                        >
                            {subtopics.length > 0 ? (
                                <Icon
                                    color={COLORS.GRAY_DARK}
                                    name={
                                        expanded
                                            ? ICON.CHEV_DOWN
                                            : ICON.CHEV_RIGHT
                                    }
                                    size={10}
                                />
                            ) : (
                                <></>
                            )}
                        </Box>
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
            {subtopics.length > 0 && expanded ? (
                subtopics.map(({ label, topic_id }, idx) => (
                    <Topic
                        key={idx}
                        id={topic_id}
                        title={label}
                        onClick={onClick}
                        isSubtopic={true}
                        selectedTopic={selectedTopic}
                        subtopics={[]}
                        topicTotals={topicTotals}
                    />
                ))
            ) : (
                <></>
            )}
        </>
    );
};

export default Topic;
