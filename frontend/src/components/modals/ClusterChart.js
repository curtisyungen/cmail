import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import convexHull from "convex-hull";

import { Chart, Switch } from "../common";
import { useAppContext } from "../../hooks";
import { Box, COLORS, Flex, FONT_SIZE, Text } from "../../styles";

Modal.setAppElement("#root");

const ClusterChart = ({ onClose, open }) => {
    const {
        featureConfig,
        modelConfig,
        modelResult: { centroids_data, clusters_data },
        topics,
    } = useAppContext();

    const [plotData, setPlotData] = useState([]);
    const [showBoundaries, setShowBoundaries] = useState(true);
    const [showCentroids, setShowCentroids] = useState(true);
    const [showPoints, setShowPoints] = useState(true);

    useEffect(() => {
        if (!open) {
            return;
        }
        const centroidTrace = getCentroidTrace();
        const clusterTraces = getClusterTraces();
        setPlotData([...clusterTraces, centroidTrace]);
    }, [open, showBoundaries, showCentroids, showPoints]);

    const getCaption = () => {
        let caption = `Model: ${modelConfig.model}. Num. clusters: ${
            modelConfig.num_clusters || "Optimal"
        }. `;
        if (featureConfig.model)
            caption += `Feature model: ${featureConfig.model}. `;
        const features = [];
        if (featureConfig.include_dates) features.push("dates");
        if (featureConfig.include_subjects) features.push("subjects");
        if (featureConfig.include_bodies) features.push("bodies");
        if (featureConfig.include_recipients) features.push("recipients");
        if (featureConfig.include_senders) features.push("senders");
        if (featureConfig.include_labels) features.push("labels");
        if (featureConfig.include_thread_ids) features.push("thread_ids");
        if (featureConfig.include_capitals) features.push("capitals");
        return (caption += `Features: ${features.join(", ")}.`);
    };

    const getCentroidTrace = () => {
        if (!showCentroids) return {};
        return {
            x: centroids_data.map((centroid) => centroid.x),
            y: centroids_data.map((centroid) => centroid.y),
            mode: "markers+text",
            type: "scatter",
            name: "",
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
    };

    const getClusterTraces = () => {
        return clusters_data.flatMap((cluster, idx) => {
            const points = cluster.x.map((x, i) => [x, cluster.y[i]]);
            const hullIndices = convexHull(points);
            const hullPoints = hullIndices.map(([i]) => points[i]);
            const hullX = hullPoints.map(([x]) => x);
            const hullY = hullPoints.map(([_, y]) => y);
            const color = `${(idx * 30) % 255}, ${(idx * 50) % 255}, ${
                (idx * 100) % 255
            }`;
            const boundaries = showBoundaries
                ? {
                      x: [...hullX, hullX[0]],
                      y: [...hullY, hullY[0]],
                      mode: "lines",
                      fill: "toself",
                      fillcolor: `rgba(${color}, 0.2)`,
                      line: { color: COLORS.BLACK },
                      name: `C${idx + 1} (${getLabel(idx)})`,
                      hoverInfo: "skip",
                  }
                : {};
            const borders = showPoints
                ? {
                      x: cluster.x,
                      y: cluster.y,
                      mode: "markers",
                      type: "scatter",
                      name: `C${idx + 1} (${getLabel(idx)})`,
                      marker: {
                          size: 10,
                          color: COLORS.BLACK,
                      },
                      hoverInfo: "skip",
                  }
                : {};
            const clusters = showPoints
                ? {
                      x: cluster.x,
                      y: cluster.y,
                      mode: "markers",
                      type: "scatter",
                      name: `C${idx + 1} (${getLabel(idx)})`,
                      marker: {
                          size: 8,
                          color: `rgb(${color})`,
                      },
                      text: cluster.email_data.map(
                          ({ from, raw_subject }) =>
                              `From: ${from}<br>Subject: ${raw_subject}`
                      ),
                      hoverInfo: "text",
                  }
                : {};
            const shadows = showPoints
                ? {
                      x: cluster.x,
                      y: cluster.y,
                      mode: "markers",
                      type: "scatter",
                      marker: {
                          size: 16,
                          color: `rgb(${color})`,
                          opacity: 0.2,
                      },
                      hoverinfo: "skip",
                      name: "",
                  }
                : {};
            return [borders, boundaries, clusters, shadows];
        });
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
                    <Flex
                        justifyContent="space-between"
                        style={{ marginTop: "5px" }}
                    >
                        <Flex style={{ marginRight: "10px" }}>
                            <Text style={{ marginRight: "3px" }}>
                                Boundaries
                            </Text>
                            <Switch
                                enabled={showBoundaries}
                                onClick={() =>
                                    setShowBoundaries(!showBoundaries)
                                }
                            />
                        </Flex>
                        <Flex style={{ marginRight: "10px" }}>
                            <Text style={{ marginRight: "3px" }}>
                                Centroids
                            </Text>
                            <Switch
                                enabled={showCentroids}
                                onClick={() => setShowCentroids(!showCentroids)}
                            />
                        </Flex>
                        <Flex style={{ marginRight: "10px" }}>
                            <Text style={{ marginRight: "3px" }}>Points</Text>
                            <Switch
                                enabled={showPoints}
                                onClick={() => setShowPoints(!showPoints)}
                            />
                        </Flex>
                    </Flex>
                </Box>
                <Chart data={plotData} />
                <Box margin={{ top: 5 }}>
                    <Text>{getCaption()}</Text>
                </Box>
            </Box>
        </Modal>
    );
};

export default ClusterChart;
