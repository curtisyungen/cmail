import React from "react";

import { Box, COLORS, DIMENS } from "../../styles";

const BoxWithShadow = ({ children, margin, style, ...otherProps }) => {
    return (
        <Box borderRadius={DIMENS.BORDER_RADIUS_L} padding={2}>
            <Box
                background={COLORS.WHITE}
                borderRadius={DIMENS.BORDER_RADIUS_L}
                margin={margin}
                style={{
                    boxShadow: `0px 1px 2px ${COLORS.GRAY_MEDIUM}`,
                    userSelect: "none",
                    width: "100%",
                    ...style,
                }}
                {...otherProps}
            >
                {children}
            </Box>
        </Box>
    );
};

export default BoxWithShadow;
