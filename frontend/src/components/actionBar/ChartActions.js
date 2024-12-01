import React, { useState } from "react";

import { ClusterChart } from "../charts";
import { Icon } from "../common";
import { useAppContext } from "../../hooks";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";

const ChartActions = ({ isRunning }) => {
    const { clustersData } = useAppContext();

    const [showModal, setShowModal] = useState(false);

    const disabled = isRunning || !clustersData || clustersData.length === 0;

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
                    onClick={() => setShowModal(true)}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={disabled ? COLORS.GRAY_MEDIUM : COLORS.BLUE_DARK}
                        name={ICON.TRASH}
                        size={24}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text
                        center
                        color={disabled ? COLORS.GRAY_MEDIUM : COLORS.BLACK}
                        fontSize={FONT_SIZE.S}
                    >
                        View chart
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Chart</Text>

            <ClusterChart
                onClose={() => setShowModal(false)}
                open={showModal}
            />
        </>
    );
};

export default ChartActions;
