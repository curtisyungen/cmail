import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Box, Flex, Text, TextEllipsis } from "../../styles";

const Body = styled(TextEllipsis)``;

const Sender = styled(TextEllipsis)``;

const Subject = styled(TextEllipsis)``;

const CLIPPED_BODY_LENGTH = 50;

const Email = ({ cluster, email }) => {
    // console.log("email: ", email);

    const getRawBody = () => {
        const raw_body =
            typeof email.raw_body === Array
                ? email.raw_body[0]
                : email.raw_body;
        return raw_body.slice(0, CLIPPED_BODY_LENGTH);
    };

    return (
        <Box
            borderWidth={{ all: 1 }}
            margin={{ bottom: 5 }}
            padding={10}
            width={300}
        >
            <Flex>
                <Box>
                    <Sender fontSize={14}>{email.from_name}</Sender>
                    <Subject fontSize={10}>{email.raw_subject}</Subject>
                    <Body fontSize={10}>
                        {getRawBody()}
                        {email.raw_body.length > CLIPPED_BODY_LENGTH
                            ? "..."
                            : ""}
                    </Body>
                </Box>
                <Box height="100%" width={50}>
                    <Text textAlign="center">{cluster || "-"}</Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default Email;
