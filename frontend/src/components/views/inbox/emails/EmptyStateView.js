import React from "react";

import mailIcon from "../../../../assets/mailIcon.svg";
import { Box, Text } from "../../../../styles";

const EmptyStateView = () => {
    return (
        <Box
            alignItems="center"
            height="100%"
            justifyContent="center"
            style={{ flex: 1 }}
        >
            <img src={mailIcon} style={{ height: "180px" }} />
            <Text bold>Select an item to read</Text>
            <Text>Nothing is selected</Text>
        </Box>
    );
};

export default EmptyStateView;
