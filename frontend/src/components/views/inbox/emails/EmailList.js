import React, { useEffect, useState } from "react";

import Email from "./Email";
import Header from "./Header";
import { useAppActions, useAppContext } from "../../../../hooks";
import { STATUS } from "../../../../res";
import { Box, COLORS, DIMENS, FONT_SIZE, Text } from "../../../../styles";

const EmailList = () => {
    const {
        emails,
        emailToTopicIdMap,
        searchTerm,
        selectedEmail,
        selectedTopic,
        status,
        topics,
    } = useAppContext();
    const { setSelectedEmail } = useAppActions();

    const [filteredEmails, setFilteredEmails] = useState([]);

    useEffect(() => {
        filterEmails();
    }, [emails, searchTerm]);

    const handleEmailClick = (email) => {
        setSelectedEmail(selectedEmail?.id === email.id ? null : email);
    };

    const filterEmails = () => {
        if (!searchTerm || searchTerm.trim().length === 0) {
            setFilteredEmails(emails);
            return;
        }
        const searchTermLower = searchTerm.toLowerCase();
        const filteredEmails = emails.filter(
            ({ body, from, subject }) =>
                body.toLowerCase().includes(searchTermLower) ||
                from.toLowerCase().includes(searchTermLower) ||
                subject.toLowerCase().includes(searchTermLower)
        );
        setFilteredEmails(filteredEmails);
    };

    return (
        <Box
            borderColor={COLORS.BORDER}
            height={DIMENS.EMAIL_LIST_HEIGHT}
            justifyContent="flex-start"
            style={{
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                minWidth: DIMENS.EMAIL_WIDTH,
                overflowX: "hidden",
                overflowY: "scroll",
            }}
            width={DIMENS.EMAIL_WIDTH}
        >
            {status === STATUS.FETCHING_EMAILS ? (
                <Box margin={{ top: 10 }} width={DIMENS.EMAIL_WIDTH}>
                    <Text center fontSize={FONT_SIZE.S}>
                        Loading emails...
                    </Text>
                </Box>
            ) : (
                <>
                    <Header selectedTopic={selectedTopic} topics={topics} />
                    {filteredEmails?.map((email, idx) => (
                        <Email
                            key={idx}
                            email={email}
                            isSelected={selectedEmail?.id === email.id}
                            onClick={() => handleEmailClick(email)}
                            topicId={emailToTopicIdMap[email.id]}
                        />
                    ))}
                </>
            )}
        </Box>
    );
};

export default EmailList;
