import React from "react";
import { Bar } from "react-chartjs-2";

const ClusterVisualization = ({ cluster }) => {
    const labels = cluster.keywords.map((keyword) => keyword[0]);
    const dataValues = cluster.keywords.map((keyword) => keyword[1]);

    const data = {
        labels,
        datasets: [
            {
                label: `Cluster ${cluster.cluster_id} - ${cluster.topic}`,
                data: dataValues,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2>
                Cluster {cluster.cluster_id}: {cluster.topic}
            </h2>
            <Bar data={data} />
        </div>
    );
};

export default ClusterVisualization;
