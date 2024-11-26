import React, { useEffect, useState } from "react";
import axios from "axios";

import Email from "./Email";

const EmailList = ({ refreshEmails }) => {
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
            console.log("emails response: ", response.data);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return emails.map((email, idx) => <Email key={idx} email={email} />);
};

export default EmailList;
