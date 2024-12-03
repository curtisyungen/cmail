import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Modal from "react-modal";

import { useAppContext } from "../../hooks";
import { Box, COLORS } from "../../styles";

Modal.setAppElement("#root");

const ClusterChart = ({ onClose, open }) => {
    const {
        modelResult: { centroids_data, clusters_data },
    } = useAppContext();

    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const centroidTrace = {
            x: centroids_data.map((centroid) => centroid.x),
            y: centroids_data.map((centroid) => centroid.y),
            mode: "markers+text",
            type: "scatter",
            name: "Centroids",
            marker: {
                size: 12,
                color: "black",
                symbol: "x",
            },
            text: centroids_data.map((_, idx) => `C${idx + 1}`),
            textposition: "top center",
            textfont: {
                size: 10,
                color: COLORS.BLACK,
            },
        };

        const clusterTraces = clusters_data.map((cluster, idx) => {
            return {
                x: cluster.x,
                y: cluster.y,
                mode: "markers",
                type: "scatter",
                name: `Cluster ${idx + 1}`,
                marker: {
                    size: 4,
                    color: `rgb(${(idx * 30) % 255}, ${(idx * 50) % 255}, ${
                        (idx * 100) % 255
                    })`,
                },
            };
        });

        setPlotData([...clusterTraces, centroidTrace]);
    }, [open]);

    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            style={{
                content: {
                    height: "fit-content",
                    margin: "auto",
                    userSelect: "none",
                },
            }}
        >
            <Box>
                <Plot
                    data={plotData}
                    layout={{
                        title: "Clusters",
                        xaxis: { title: "X Cord." },
                        yaxis: { title: "Y Cord." },
                        showlegend: true,
                    }}
                />
            </Box>
        </Modal>
    );
};

export default ClusterChart;
