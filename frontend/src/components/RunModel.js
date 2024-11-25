import React, { useState } from "react";
import axios from "axios";

const RunModel = () => {
    const [generate, setGenerate] = useState(false);
    const [response, setResponse] = useState("");

    const handleSubmit = async () => {
        try {
            const res = await axios.post("/api/run-model", {
                generate,
            });
            setResponse(res.data.message);
        } catch (error) {
            setResponse(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div>
            <h1>Run Model</h1>
            <label>
                <input
                    type="checkbox"
                    checked={generate}
                    onChange={(e) => setGenerate(e.target.checked)}
                />
                Generate New Data
            </label>
            <button onClick={handleSubmit}>Run K-means</button>
            <p>{response}</p>
        </div>
    );
};

export default RunModel;
