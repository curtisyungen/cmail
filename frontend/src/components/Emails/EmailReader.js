import React from "react";

import Avatar from "./Avatar";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";
import { DateTimeUtils } from "../../utils";
import { UNKNOWN_SENDER } from "../../res";
import { useAppContext, useKeywords } from "../../hooks";

const Body = ({ body, keywords = [] }) => {
    const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
    const highlightedBody = body.replace(
        keywordPattern,
        (match) => `<strong>${match}</strong>`
    );
    return <Text dangerouslySetInnerHTML={{ __html: highlightedBody }} />;
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

const EmailReader = () => {
    const { selectedEmail } = useAppContext();
    const { keywords } = useKeywords();
    const { date, from, body, subject, to } = selectedEmail;
    return (
        <Box
            justifyContent="flex-start"
            style={{ flex: 1, height: "100%", overflowY: "scroll" }}
        >
            <Subject subject={subject} />
            <Spacer />
            <Box background={COLORS.WHITE} borderRadius={5} padding={10}>
                <Header date={date} from={from} to={to} />
                <Body body={body} keywords={keywords} />
            </Box>
        </Box>
    );
};

export default EmailReader;
