import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Modal from "react-modal";

import { useAppContext } from "../../hooks";
import { Box, COLORS, FONT_SIZE, Select, Text } from "../../styles";

Modal.setAppElement("#root");

const KeywordChart = ({ onClose, open }) => {
    const {
        modelResult: { keyword_counts },
    } = useAppContext();

    const [selectedCluster, setSelectedCluster] = useState("All Clusters");
    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        if (!open || !keyword_counts) {
            return;
        }

        if (selectedCluster === "All Clusters") {
            const combinedData = Object.values(keyword_counts).map(
                (clusterData, index) => generateClusterData(clusterData, index)
            );
            setPlotData(combinedData);
        } else {
            const clusterIndex = parseInt(selectedCluster);
            const clusterData = keyword_counts[clusterIndex];
            const clusterPlotData = generateClusterData(
                clusterData,
                clusterIndex
            );
            setPlotData([clusterPlotData]);
        }
    }, [open, keyword_counts, selectedCluster]);

    const generateClusterData = (clusterData, clusterId) => {
        const keywords = clusterData.map((item) => item[0]);
        const counts = clusterData.map((item) => item[1]);

        return {
            x: keywords,
            y: counts,
            type: "bar",
            name: `Cluster ${clusterId}`,
            marker: { color: COLORS.blue },
        };
    };

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
                <Box alignItems="center">
                    <Text bold center fontSize={FONT_SIZE.XL}>
                        Cluster Keywords
                    </Text>
                    <Select
                        onChange={(e) => setSelectedCluster(e.target.value)}
                        style={{ marginTop: "10px" }}
                        width={100}
                        value={selectedCluster}
                    >
                        <option value="All Clusters">All Clusters</option>
                        {Object.values(keyword_counts || {}).map((_, index) => (
                            <option key={index} value={index}>
                                Cluster {index + 1}
                            </option>
                        ))}
                    </Select>
                </Box>
                <Plot
                    data={plotData}
                    layout={{
                        xaxis: {
                            title: "Keyword",
                            tickangle: 300,
                        },
                        yaxis: { title: "Count" },
                        barmode: "group",
                        showlegend: true,
                    }}
                />
            </Box>
        </Modal>
    );
};

export default KeywordChart;
