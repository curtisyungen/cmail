import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import Email from "./Email";
import Header from "./Header";
import { Box, COLORS, DIMENS } from "../../styles";
import { AppContext } from "../../AppContext";

const EmailList = ({
    categories,
    refreshEmails,
    setSelectedEmail,
    topics,
    topicsMap,
}) => {
    const { state } = useContext(AppContext);
    const { emails, loading, selectedEmail, selectedTopic } = state;

    const getCategory = (email) => {
        try {
            const { id } = email;
            const clusterId = topicsMap[id].cluster_id;
            let name = "";
            for (const { label, topic_id } of topics) {
                if (topic_id === clusterId) {
                    name = label;
                    break;
                }
            }
            return { name };
        } catch (e) {
            console.log("Error getting category: ", e);
        }
    };

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
                    category={null}
                    email={email}
                    isSelected={selectedEmail?.id === email.id}
                    onClick={() => handleEmailClick(email)}
                    selectedTopic={selectedTopic}
                    topics={topicsMap[email.id]}
                />
            ))}
        </Box>
    );
};

export default EmailList;
