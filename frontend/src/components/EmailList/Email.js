import React from "react";

import { Box, Text } from "../../styles";

const Email = ({ email }) => {
    console.log("email: ", email);
    return (
        <Box
            borderWidth={1}
            clickable
            cursor="pointer"
            margin={{ bottom: 5 }}
            padding={10}
        >
            <Text>{email.from}</Text>
            <Text>{email.to}</Text>
            <Text>{email.raw_body}</Text>
        </Box>
    );
};

export default Email;
