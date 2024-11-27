import React from "react";

import { Box, COLORS, DIMENS, FONT_SIZE, TextEllipsis } from "../../styles";
import { ALL_CLUSTERS, UNKNOWN_SENDER } from "../../res";

const CLIPPED_BODY_LENGTH = 50;

const Email = ({ cluster, email, isSelected, onClick, selectedCluster }) => {
    const getRawBody = () => {
        const raw_body =
            typeof email.raw_body === Array
                ? email.raw_body[0]
                : email.raw_body;
        return raw_body.slice(0, CLIPPED_BODY_LENGTH);
    };

    if (selectedCluster !== ALL_CLUSTERS && cluster !== selectedCluster) {
        return null;
    }

    return (
        <Box
            background={isSelected ? COLORS.BLUE_LIGHT : COLORS.WHITE}
            borderColor={COLORS.BORDER}
            clickable={true}
            height={DIMENS.EMAIL_HEIGHT}
            hoverBackground={isSelected ? COLORS.BLUE_LIGHT : COLORS.GRAY_LIGHT}
            onClick={onClick}
            padding={10}
            style={{ borderBottomWidth: 1, minHeight: DIMENS.EMAIL_HEIGHT }}
            transition={0}
            width="100%"
        >
            <TextEllipsis>{email.from_name || UNKNOWN_SENDER}</TextEllipsis>
            <TextEllipsis fontSize={FONT_SIZE.S}>
                {email.raw_subject || "No subject"}
            </TextEllipsis>
            <TextEllipsis fontSize={FONT_SIZE.S}>
                {getRawBody()}
                {email.raw_body.length > CLIPPED_BODY_LENGTH ? "..." : ""}
            </TextEllipsis>
        </Box>
    );
};

export default Email;
