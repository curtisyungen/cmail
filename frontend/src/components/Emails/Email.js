import React from "react";

import Tag from "./Tag";
import { ALL_TOPICS, UNKNOWN_SENDER } from "../../res";
import { Box, COLORS, DIMENS, FONT_SIZE, TextEllipsis } from "../../styles";

const CLIPPED_BODY_LENGTH = 50;

const Email = ({
    category,
    email,
    isSelected,
    onClick,
    selectedTopic,
    topics,
}) => {
    const getClippedBody = () => {
        const body = typeof email.body === Array ? email.body[0] : email.body;
        return body.slice(0, CLIPPED_BODY_LENGTH);
    };

    if (selectedTopic !== ALL_TOPICS && topics.cluster_id !== selectedTopic) {
        return null;
    }

    return (
        <Box
            background={isSelected ? COLORS.BLUE_LIGHT : COLORS.WHITE}
            borderColor={COLORS.BORDER}
            clickable={true}
            height="fit-content"
            hoverBackground={isSelected ? COLORS.BLUE_LIGHT : COLORS.GRAY_LIGHT}
            onClick={onClick}
            padding={10}
            style={{
                borderBottomWidth: 1,
                maxHeight: DIMENS.EMAIL_HEIGHT,
                userSelect: "none",
            }}
            transition={0}
            width="100%"
        >
            <TextEllipsis>{email.from || UNKNOWN_SENDER}</TextEllipsis>
            <TextEllipsis fontSize={FONT_SIZE.S}>
                {email.subject || "No subject"}
            </TextEllipsis>
            <TextEllipsis fontSize={FONT_SIZE.S}>
                {getClippedBody()}
                {email.body.length > CLIPPED_BODY_LENGTH ? "..." : ""}
            </TextEllipsis>
            <Tag color={category?.color} tag={category?.name} />
        </Box>
    );
};

export default Email;
