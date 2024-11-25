import React, { useEffect, useState } from "react";
import axios from "axios";

import { ClusterVisualization } from "./components";

const App = () => {
    const [clusters, setClusters] = useState([]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/clusters")
            .then((response) => {
                setClusters(response.data.clusters);
            })
            .catch((error) => console.error("Error fetching clusters:", error));
    }, []);

    if (clusters.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Cluster Visualization</h1>
            {clusters.map((cluster) => (
                <ClusterVisualization
                    key={cluster.cluster_id}
                    cluster={cluster}
                />
            ))}
        </div>
    );
};

export default App;
