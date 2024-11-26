import React, { useState } from "react";
import axios from "axios";

import { Box, Button, Select, Text } from "../styles";

const DEFAULT_EMAIL_COUNT = 100;
const DEFAULT_NUM_CLUSTERS = 12;

const SettingsBar = ({ setClusters, setEmails }) => {
    const [emailCount, setEmailCount] = useState(DEFAULT_EMAIL_COUNT);
    const [error, setError] = useState("");
    const [generate, setGenerate] = useState(false);
    const [numClusters, setNumClusters] = useState(DEFAULT_NUM_CLUSTERS);

    const emailCountOptions = Array.from(
        { length: 10 },
        (_, i) => (i + 1) * 100
    );

    const handleSubmit = async () => {
        setClusters([]);
        setError("");

        console.log("numClusters: ", numClusters);

        try {
            const res = await axios.post("/api/run-model", {
                generate,
                emailCount,
                numClusters,
            });
            setClusters(res.data.clusters);
            console.log("emails: ", res.data.emails);
            setEmails(res.data.emails);
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <Box width={300}>
            <Box>
                <Text>Number of emails</Text>
                <Select
                    value={emailCount}
                    onChange={(e) => setEmailCount(parseInt(e.target.value))}
                >
                    {" "}
                    {emailCountOptions.map((count) => (
                        <option key={count} value={count}>
                            {count}
                        </option>
                    ))}
                </Select>
            </Box>
            <Box>
                <Text>Number of clusters</Text>
                <Select
                    value={numClusters}
                    onChange={(e) => setNumClusters(parseInt(e.target.value))}
                >
                    {" "}
                    {Array.from({ length: 20 }, (_, index) => index + 1).map(
                        (num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        )
                    )}
                </Select>
            </Box>
            <Box>
                <Text>
                    <input
                        type="checkbox"
                        checked={generate}
                        onChange={(e) => setGenerate(e.target.checked)}
                    />
                    Generate New Data
                </Text>
            </Box>
            <Button onClick={handleSubmit}>Execute</Button>
        </Box>
    );
};

export default SettingsBar;
