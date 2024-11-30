import React, { useEffect, useState } from "react";

import { Box, COLORS, FONT_SIZE, Text } from "../styles";

const Loading = () => {
    return (
        <Box
            background={`${COLORS.WHITE}CC`}
            height="100vh"
            style={{
                bottom: "0px",
                left: "0px",
                position: "fixed",
                right: "0px",
                top: "0px",
            }}
        >
            <Text center fontSize={FONT_SIZE.XXL}>
                Loading...
            </Text>
        </Box>
    );
};

export default Loading;
