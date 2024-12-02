import React, { useState } from "react";

import { ClusterChart } from "../charts";
import { Icon } from "../common";
import { useAppContext } from "../../hooks";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";

const AnalysisActions = () => {
    const { kmeansData, status } = useAppContext();
    const { clusters_data, silhouette_score } = kmeansData;

    console.log("kmeansData: ", kmeansData);

    const [showModal, setShowModal] = useState(false);

    const disabled = status || !clusters_data || clusters_data.length === 0;

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
                    onClick={() => setShowModal(true)}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={disabled ? COLORS.GRAY_MEDIUM : COLORS.BLUE_DARK}
                        name={ICON.CHART}
                        size={24}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text
                        center
                        color={disabled ? COLORS.GRAY_MEDIUM : COLORS.BLACK}
                        fontSize={FONT_SIZE.S}
                    >
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
                    onClick={() => setShowModal(true)}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Box height={24} margin={{ bottom: 5 }}>
                        <Text
                            center
                            color={disabled ? COLORS.GRAY_MEDIUM : COLORS.BLACK}
                            fontSize={FONT_SIZE.XXL}
                        >
                            {isNaN(silhouette_score)
                                ? "N/A"
                                : Math.round(silhouette_score * 100) / 100}
                        </Text>
                    </Box>
                    <Text
                        center
                        color={disabled ? COLORS.GRAY_MEDIUM : COLORS.BLACK}
                        fontSize={FONT_SIZE.S}
                    >
                        Silhouette
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Analysis</Text>

            <ClusterChart
                onClose={() => setShowModal(false)}
                open={showModal}
            />
        </>
    );
};

export default AnalysisActions;
