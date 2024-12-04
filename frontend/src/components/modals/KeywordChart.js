import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Modal from "react-modal";

import { useAppContext } from "../../hooks";
import { Box, COLORS } from "../../styles";

Modal.setAppElement("#root");

const KeywordChart = ({ onClose, open }) => {
    const {
        modelResult: { clusters, clusters_data },
    } = useAppContext();

    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const clusters = [];

        const clusterTraces = clusters.map((cluster, index) => {
            return {
                x: cluster.keywords.map((kw) => kw.word),
                y: cluster.keywords.map((kw) => kw.weight),
                type: "bar",
                name: cluster.label || `Cluster ${index + 1}`,
                marker: {
                    color: COLORS.blue,
                },
            };
        });

        setPlotData(clusterTraces);
    }, [open, clusters]);

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
                        title: "Top Keywords by Cluster",
                        barmode: "group", // Group bars for comparison
                        xaxis: { title: "Keywords" },
                        yaxis: { title: "Weight" },
                        showlegend: true,
                        margin: { l: 50, r: 50, t: 50, b: 50 },
                    }}
                />
            </Box>
        </Modal>
    );
};

export default KeywordChart;
