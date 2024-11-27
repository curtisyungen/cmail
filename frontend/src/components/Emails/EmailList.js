import React, { useEffect, useState } from "react";
import axios from "axios";

import Email from "./Email";
import { Box, COLORS, DIMENS } from "../../styles";

const EmailList = ({
    clusterMap,
    refreshEmails,
    selectedCluster,
    selectedEmail,
    setSelectedEmail,
}) => {
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (refreshEmails) {
            fetchEmails();
        }
    }, [refreshEmails]);

    async function fetchEmails() {
        try {
            const response = await axios.get("/api/get-emails");
            if (response.data.status === "success") {
                setEmails(response.data.emails);
            } else {
                setError(response.data.message || "Failed to fetch emails.");
            }
        } catch (err) {
            console.log("Error: ", err);
            setError("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    }

    const handleEmailClick = (email) => {
        setSelectedEmail(selectedEmail?.id === email.id ? null : email);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
            {emails.map((email, idx) => (
                <Email
                    key={idx}
                    cluster={clusterMap[email.id]}
                    email={email}
                    isSelected={selectedEmail?.id === email.id}
                    onClick={() => handleEmailClick(email)}
                    selectedCluster={selectedCluster}
                />
            ))}
        </Box>
    );
};

export default EmailList;
