import React from "react";

import { Box, COLORS } from "../../styles";

const BoxWithShadow = ({ children, margin, style, ...otherProps }) => {
    return (
        <Box borderRadius={5} padding={2}>
            <Box
                background={COLORS.WHITE}
                borderRadius={5}
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
