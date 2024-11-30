import React, { useEffect } from "react";

import Email from "./Email";
import Header from "./Header";
import { useAppActions, useAppContext } from "../../hooks";
import { Box, COLORS, DIMENS } from "../../styles";

const EmailList = () => {
    const { emails, loading, selectedEmail, selectedTopic, topics, topicsMap } =
        useAppContext();
    const { setSelectedEmail } = useAppActions();

    useEffect(() => {
        console.log("topicsMap: ", topicsMap);
    }, [topicsMap]);

    const handleEmailClick = (email) => {
        setSelectedEmail(selectedEmail?.id === email.id ? null : email);
    };

    if (loading) return <div>Loading...</div>;

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
                overflowX: "hidden",
                overflowY: "scroll",
            }}
            width={DIMENS.EMAIL_WIDTH}
        >
            <Header selectedTopic={selectedTopic} topics={topics} />
            {emails.map((email, idx) => (
                <Email
                    key={idx}
                    email={email}
                    isSelected={selectedEmail?.id === email.id}
                    onClick={() => handleEmailClick(email)}
                    topicId={topicsMap[idx]?.cluster_id}
                />
            ))}
        </Box>
    );
};

export default EmailList;
