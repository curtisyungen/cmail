import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Modal from "react-modal";

import { useAppContext } from "../../hooks";
import { Box } from "../../styles";

const ClusterChart = ({ onClose, open }) => {
    const {
        kmeansData: { clusters_data },
    } = useAppContext();

    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const traceData = clusters_data.map((cluster, idx) => {
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

        setPlotData(traceData);
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
