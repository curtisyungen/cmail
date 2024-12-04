import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Modal from "react-modal";

import { useAppContext } from "../../hooks";
import { Box, COLORS, FONT_SIZE, Select, Text } from "../../styles";

Modal.setAppElement("#root");

const KeywordChart = ({ onClose, open }) => {
    const {
        modelResult: { keyword_counts },
        topics,
    } = useAppContext();

    const [selectedCluster, setSelectedCluster] = useState("All Clusters");
    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        if (!open || !keyword_counts) {
            return;
        }

        if (selectedCluster === "All Clusters") {
            const combinedData = Object.values(keyword_counts).map(
                (clusterData, index) => {
                    const label = getLabel(index);
                    return generateClusterData(clusterData, index, label);
                }
            );
            setPlotData(combinedData);
        } else {
            const clusterIndex = parseInt(selectedCluster);
            const clusterData = keyword_counts[clusterIndex];
            const label = getLabel(clusterIndex);
            const clusterPlotData = generateClusterData(
                clusterData,
                clusterIndex,
                label
            );
            setPlotData([clusterPlotData]);
        }
    }, [open, keyword_counts, selectedCluster]);

    const generateClusterData = (clusterData, clusterId, label) => {
        const keywords = clusterData.map((item) => item[0]);
        const counts = clusterData.map((item) => item[1]);
        return {
            id: clusterId,
            x: keywords,
            y: counts,
            label,
            type: "bar",
            name: `C${clusterId} (${label})`,
            marker: { color: COLORS.blue },
        };
    };

    const getLabel = (clusterIndex) => {
        return (
            topics.find(({ topic_id }) => topic_id === clusterIndex)?.label ||
            "N/A"
        );
    };

    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            style={{
                content: {
                    height: "fit-content",
                    margin: "auto",
                    maxWidth: "800px",
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
                        width={160}
                        value={selectedCluster}
                    >
                        <option value="All Clusters">All Clusters</option>
                        {Object.values(keyword_counts || {}).map((_, index) => (
                            <option key={index} value={index}>
                                {`C${index + 1} (${getLabel(index)})`}
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
