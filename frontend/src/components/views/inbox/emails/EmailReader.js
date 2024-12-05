import React from "react";

import Avatar from "./Avatar";
import { useAppContext, useKeywords } from "../../../../hooks";
import { UNKNOWN_SENDER } from "../../../../res";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../../../styles";
import { DateTimeUtils } from "../../../../utils";

const Body = ({ body, keywords = [] }) => {
    const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
    const highlightedBody = body.replace(
        keywordPattern,
        (match) => `<strong>${match}</strong>`
    );
    return <Text dangerouslySetInnerHTML={{ __html: body }} />;
};

const Header = ({ date, from, to }) => {
    const sender = from.split("<")[0]?.trim() || UNKNOWN_SENDER;
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
    return (
        <Box
            height={DIMENS.SPACING_STANDARD}
            style={{ minHeight: DIMENS.SPACING_STANDARD }}
        />
    );
};

const Subject = ({ subject }) => {
    return (
        <Box
            background={COLORS.WHITE}
            borderRadius={DIMENS.BORDER_RADIUS_L}
            padding={10}
            style={{
                boxShadow: `0px 1px 2px ${COLORS.GRAY_MEDIUM}`,
            }}
        >
            <Text bold>{subject}</Text>
        </Box>
    );
};

const EmailReader = () => {
    const { selectedEmail } = useAppContext();
    const { keywords } = useKeywords();
    const { date, from, raw_body, raw_subject, to } = selectedEmail;
    return (
        <Box
            justifyContent="flex-start"
            style={{ flex: 1, height: "100%", overflowY: "scroll", padding: 2 }}
        >
            <Subject subject={raw_subject} />
            <Spacer />
            <Box
                background={COLORS.WHITE}
                borderRadius={DIMENS.BORDER_RADIUS_L}
                margin={{ bottom: 150 }}
                padding={10}
                style={{ boxShadow: `0px 1px 2px ${COLORS.GRAY_MEDIUM}` }}
            >
                <Header date={date} from={from} to={to} />
                <Body body={raw_body} keywords={keywords} />
            </Box>
        </Box>
    );
};

export default EmailReader;
