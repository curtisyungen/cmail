import React, { useEffect, useState } from "react";
import axios from "axios";

import CategoryActions from "./CategoryActions";
import { Icon } from "../common";
import { LS } from "../../res";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";
import { StorageUtils } from "../../utils";

const OtherActions = ({ isRunning }) => {
    const [hasCachedData, setHasCachedData] = useState(false);

    useEffect(() => {
        const cachedData = StorageUtils.getItem(LS.CLUSTERS);
        setHasCachedData(!!cachedData);
    }, []);

    const handleClearCache = async () => {
        StorageUtils.clearAll();
        setHasCachedData(false);

        try {
            const result = await axios.post("/api/clear-redis");
            console.log("clear-redis result: ", result);
        } catch (e) {
            console.log("Error clearing Redis: ", e);
        }
    };

    return (
        <>
            <Flex>
                <CategoryActions isRunning={isRunning} />
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={!isRunning && hasCachedData}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        isRunning || !hasCachedData
                            ? COLORS.TRANSPARENT
                            : COLORS.GRAY_LIGHT
                    }
                    onClick={handleClearCache}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={
                            isRunning || !hasCachedData
                                ? COLORS.GRAY_MEDIUM
                                : COLORS.BLUE_DARK
                        }
                        name={ICON.TRASH}
                        size={24}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text
                        center
                        color={
                            isRunning || !hasCachedData
                                ? COLORS.GRAY_MEDIUM
                                : COLORS.BLACK
                        }
                        fontSize={FONT_SIZE.S}
                    >
                        Clear cache
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Other</Text>
        </>
    );
};

export default OtherActions;
