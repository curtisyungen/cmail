import React, { useState } from "react";
import axios from "axios";

import ClusterKeywords from "./ClusterKeywords";

const DEFAULT_EMAIL_COUNT = 100;
const DEFAULT_NUM_CLUSTERS = 12;

const RunModel = () => {
    const [clusters, setClusters] = useState([]);
    const [emailCount, setEmailCount] = useState(DEFAULT_EMAIL_COUNT);
    const [generate, setGenerate] = useState(false);
    const [numClusters, setNumClusters] = useState(DEFAULT_NUM_CLUSTERS);
    const [response, setResponse] = useState("");

    const emailCountOptions = Array.from(
        { length: 10 },
        (_, i) => (i + 1) * 100
    );

    const handleSubmit = async () => {
        try {
            const res = await axios.post("/api/run-model", {
                generate,
                emailCount,
                numClusters,
            });
            setClusters(res.data.clusters);
            setResponse(res.data.message);
        } catch (error) {
            setResponse(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div>
            <h1>Run Model</h1>
            <div>
                <label>
                    Emails to Use:
                    <select
                        value={emailCount}
                        onChange={(e) =>
                            setEmailCount(parseInt(e.target.value))
                        }
                    >
                        {emailCountOptions.map((count) => (
                            <option key={count} value={count}>
                                {count}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Number of Clusters:
                    <select
                        value={numClusters}
                        onChange={(e) =>
                            setNumClusters(parseInt(e.target.value))
                        }
                    >
                        {Array.from(
                            { length: 20 },
                            (_, index) => index + 1
                        ).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={generate}
                        onChange={(e) => setGenerate(e.target.checked)}
                    />
                    Generate New Data
                </label>
            </div>
            <button onClick={handleSubmit}>Run K-means</button>
            <p>{response}</p>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                {Object.entries(clusters).map(([cluster, keywords], idx) => (
                    <div key={idx}>
                        <ClusterKeywords title={cluster} keywords={keywords} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RunModel;
