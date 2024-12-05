import React, { useEffect, useState } from "react";

import { Box, COLORS, DIMENS, FONT_SIZE, Text } from "../../../../styles";

const Avatar = ({ name }) => {
    const [initials, setInitials] = useState("");

    useEffect(() => {
        const words = name.trim().split(/\s+/);
        const firstInitial = words[0]?.charAt(0).toUpperCase() || "";
        const secondInitial = words[1]?.charAt(0).toUpperCase() || "";
        setInitials(`${firstInitial}${secondInitial}`);
    }, [name]);

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
                {initials}
            </Text>
        </Box>
    );
};

export default Avatar;
