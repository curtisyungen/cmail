import React, { useEffect, useState } from "react";

import { Box, COLORS, FONT_SIZE, Text } from "../styles";

const Loading = () => {
    return (
        <Box background={COLORS.WHITE} height="100vh">
            <Text center fontSize={FONT_SIZE.XXL}>
                Loading...
            </Text>
        </Box>
    );
};

export default Loading;
