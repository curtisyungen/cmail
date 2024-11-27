import React from "react";
import styled from "styled-components";

import { Box, Flex, Text, TextEllipsis } from "../../styles";
import COLORS from "../../styles/Colors";
import { ALL_CLUSTERS } from "../../res";
import DIMENS from "../../styles/Dimens";

const Body = styled(TextEllipsis)``;

const Sender = styled(TextEllipsis)``;

const Subject = styled(TextEllipsis)``;

const CLIPPED_BODY_LENGTH = 50;

const Email = ({ cluster, email, isSelected, onClick, selectedCluster }) => {
    // console.log("email: ", email);

    const getRawBody = () => {
        const raw_body =
            typeof email.raw_body === Array
                ? email.raw_body[0]
                : email.raw_body;
        return raw_body.slice(0, CLIPPED_BODY_LENGTH);
    };

    if (selectedCluster !== ALL_CLUSTERS && cluster !== selectedCluster) {
        return null;
    }

    return (
        <Box
            background={isSelected ? COLORS.BLUE_LIGHT : COLORS.WHITE}
            clickable={true}
            height={DIMENS.EMAIL_HEIGHT}
            margin={{ bottom: 1 }}
            onClick={onClick}
            padding={10}
            width="100%"
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
                    <Text textAlign="center">
                        {cluster >= 0 ? cluster : "-"}
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default Email;
