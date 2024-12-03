import React, { useEffect, useState } from "react";

import { ClusterChart, ScoreModal } from "../modals";
import { Icon } from "../common";
import { useAppContext } from "../../hooks";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";

const AnalysisActions = () => {
    const { modelResult, status } = useAppContext();
    const { clusters_data, silhouette_score: ss } = modelResult;

    const [scoreColor, setScoreColor] = useState(COLORS.GRAY_MEDIUM);
    const [showClusterChart, setShowClusterChart] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);

    const disabled = status || !clusters_data || clusters_data.length === 0;

    useEffect(() => {
        let color;
        switch (true) {
            case disabled:
                color = COLORS.GRAY_MEDIUM;
                break;
            case ss <= 0.25:
                color = COLORS.RED;
                break;
            case ss <= 0.5:
                color = COLORS.ORANGE;
                break;
            case ss <= 0.75:
                color = COLORS.YELLOW;
                break;
            case ss <= 1:
                color = COLORS.GREEN;
                break;
            default:
                color = COLORS.GRAY_MEDIUM;
        }
        setScoreColor(color);
    }, [ss]);

    return (
        <>
            <Flex>
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={!disabled}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        disabled ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    onClick={() => setShowClusterChart(!disabled)}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={disabled ? COLORS.GRAY_MEDIUM : COLORS.BLUE_DARK}
                        name={ICON.CHART}
                        size={24}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text center disabled={disabled} fontSize={FONT_SIZE.S}>
                        Cluster chart
                    </Text>
                </Box>
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={!disabled}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        disabled ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    onClick={() => setShowScoreModal(!disabled)}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Box height={24} margin={{ bottom: 5 }}>
                        <Text
                            center
                            color={scoreColor}
                            fontSize={FONT_SIZE.XXL}
                        >
                            {isNaN(ss) ? "N/A" : Math.round(ss * 100) / 100}
                        </Text>
                    </Box>
                    <Text center disabled={disabled} fontSize={FONT_SIZE.S}>
                        Score
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Analysis</Text>

            <ClusterChart
                onClose={() => setShowClusterChart(false)}
                open={showClusterChart}
            />

            <ScoreModal
                onClose={() => setShowScoreModal(false)}
                open={showScoreModal}
            />
        </>
    );
};

export default AnalysisActions;
