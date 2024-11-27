import React from "react";

import { Box, COLORS, DIMENS, FONT_SIZE, Text } from "../../styles";

const Avatar = ({ name }) => {
    return (
        <Box
            alignItems="center"
            background={COLORS.BLUE_LIGHT}
            borderRadius={DIMENS.AVATAR_SIZE}
            height={DIMENS.AVATAR_SIZE}
            style={{ minWidth: DIMENS.AVATAR_SIZE }}
            width={DIMENS.AVATAR_SIZE}
        >
            <Text bold fontSize={FONT_SIZE.L}>
                {name.slice(0, 1)}
            </Text>
        </Box>
    );
};

export default Avatar;
