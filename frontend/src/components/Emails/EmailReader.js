import React from "react";

import Avatar from "./Avatar";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";
import { DateTimeUtils } from "../../utils";
import { UNKNOWN_SENDER } from "../../res";

const Body = ({ body }) => {
    return <Text>{body}</Text>;
};

const Header = ({ date, from, to }) => {
    const sender = from || UNKNOWN_SENDER;
    return (
        <Box margin={{ bottom: 20 }}>
            <Flex>
                <Avatar name={sender} />
                <Box margin={{ left: DIMENS.SPACING_STANDARD }}>
                    <Flex
                        justifyContent="space-between"
                        style={{ marginBottom: 3 }}
                    >
                        <Text>{sender}</Text>
                        <Text fontSize={FONT_SIZE.S}>
                            {DateTimeUtils.millisToDate(date)}
                        </Text>
                    </Flex>
                    <Text fontSize={FONT_SIZE.S}>To: {to}</Text>
                </Box>
            </Flex>
        </Box>
    );
};

const Spacer = () => {
    return <Box height={DIMENS.SPACING_STANDARD} />;
};

const Subject = ({ subject }) => {
    return (
        <Box background={COLORS.WHITE} borderRadius={5} padding={10}>
            <Text bold>{subject}</Text>
        </Box>
    );
};

const EmailReader = ({ selectedEmail }) => {
    const { date, from, body, subject, to } = selectedEmail;
    return (
        <Box justifyContent="flex-start" style={{ flex: 1, height: "100%" }}>
            <Subject subject={subject} />
            <Spacer />
            <Box background={COLORS.WHITE} borderRadius={5} padding={10}>
                <Header date={date} from={from} to={to} />
                <Body body={body} />
            </Box>
        </Box>
    );
};

export default EmailReader;
