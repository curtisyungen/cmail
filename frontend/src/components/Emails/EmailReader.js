import React from "react";

import { Box, Flex, Text } from "../../styles";
import COLORS from "../../styles/Colors";

const EmailReader = ({ selectedEmail }) => {
    console.log("email: ", selectedEmail);
    const { date, from_name, raw_body, raw_subject, to } = selectedEmail;
    return (
        <Box
            background={COLORS.WHITE}
            borderRadius={5}
            padding={10}
            style={{ height: "100%" }}
        >
            <Text>{raw_subject}</Text>
            <Flex>
                <Text>{from_name}</Text>
                <Text>{date}</Text>
            </Flex>
            <Text>{to}</Text>
            <Text>{raw_body}</Text>
        </Box>
    );
};

export default EmailReader;
