import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import convexHull from "convex-hull";

import { Chart } from "../common";
import { useAppContext } from "../../hooks";
import { Box, COLORS, FONT_SIZE, Text } from "../../styles";

Modal.setAppElement("#root");

const ClusterChart = ({ onClose, open }) => {
    const {
        modelResult: { centroids_data, clusters_data },
        topics,
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
                size: 10,
                color: "black",
                symbol: "x",
            },
            text: centroids_data.map((_, idx) => `${getLabel(idx)}`),
            textposition: "top center",
            textfont: {
                size: 10,
                color: COLORS.BLACK,
            },
        };

        const clusterTraces = clusters_data.flatMap((cluster, idx) => {
            const points = cluster.x.map((x, i) => [x, cluster.y[i]]);
            const hullIndices = convexHull(points);
            const hullPoints = hullIndices.map(([i]) => points[i]);
            const hullX = hullPoints.map(([x]) => x);
            const hullY = hullPoints.map(([_, y]) => y);
            return [
                {
                    x: cluster.x,
                    y: cluster.y,
                    mode: "markers",
                    type: "scatter",
                    name: `C${idx + 1} (${getLabel(idx)})`,
                    marker: {
                        size: 4,
                        color: `rgb(${(idx * 30) % 255}, ${(idx * 50) % 255}, ${
                            (idx * 100) % 255
                        })`,
                    },
                },
                {
                    x: [...hullX, hullX[0]],
                    y: [...hullY, hullY[0]],
                    mode: "lines",
                    fill: "toself",
                    fillcolor: `rgba(${(idx * 30) % 255}, ${
                        (idx * 50) % 255
                    }, ${(idx * 100) % 255}, 0.2)`,
                    line: { color: "rgba(0,0,0,0)" },
                    name: `C${idx + 1} Boundary`,
                },
            ];
        });

        setPlotData([...clusterTraces, centroidTrace]);
    }, [open]);

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
                    userSelect: "none",
                    width: "800px",
                },
            }}
        >
            <Box>
                <Box alignItems="center" margin={{ bottom: 10 }}>
                    <Text bold center fontSize={FONT_SIZE.XL}>
                        Clusters
                    </Text>
                </Box>
                <Chart data={plotData} />
            </Box>
        </Modal>
    );
};

export default ClusterChart;
