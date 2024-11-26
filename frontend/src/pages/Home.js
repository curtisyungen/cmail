import React, { useState } from "react";

import { ClusterKeywords, EmailList, SettingsBar } from "../components";
import { Box } from "../styles";

const Home = () => {
    const [clusters, setClusters] = useState({});
    const [emails, setEmails] = useState([]);

    return (
        <Box padding={10}>
            <SettingsBar setClusters={setClusters} setEmails={setEmails} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                {Object.entries(clusters).map(([_, keywords], idx) => (
                    <div key={idx}>
                        <ClusterKeywords title={idx + 1} keywords={keywords} />
                    </div>
                ))}

                <EmailList emails={emails} />
            </div>
        </Box>
    );
};

export default Home;
