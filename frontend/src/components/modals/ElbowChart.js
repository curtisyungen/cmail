import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Modal from "react-modal";

import { useAppContext } from "../../hooks";
import { Box, COLORS } from "../../styles";

Modal.setAppElement("#root");

const ElbowChart = ({ onClose, open }) => {
    const {
        modelResult: { elbow_data },
    } = useAppContext();

    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const { inertias } = elbow_data;
        const xValues = Array.from(
            { length: inertias.length },
            (_, i) => i + 2
        );
        const yValues = inertias;

        const elbowTrace = {
            x: xValues,
            y: yValues,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: COLORS.blue },
            name: "Inertia",
        };

        setPlotData([elbowTrace]);
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
                        title: "Elbow Method",
                        xaxis: { title: "Num. Clusters" },
                        yaxis: { title: "Inertia" },
                        showlegend: true,
                    }}
                />
            </Box>
        </Modal>
    );
};

export default ElbowChart;
