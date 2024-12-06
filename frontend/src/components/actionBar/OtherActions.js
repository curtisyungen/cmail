import React, { useState } from "react";

import CategoryActions from "./CategoryActions";
import { Icon } from "../common";
import { useApi, useAppContext } from "../../hooks";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";
import { StorageUtils } from "../../utils";

const OtherActions = () => {
    const { clearEmailsFromRedis } = useApi();
    const { setEmails, setModelResult, setTopics, setTopicsMap, status } =
        useAppContext();

    const [loading, setLoading] = useState(false);

    const handleClearCache = async () => {
        try {
            setLoading(true);
            StorageUtils.clearAll();
            await clearEmailsFromRedis();
            setEmails([]);
            setModelResult({});
            setTopics([]);
            setTopicsMap({});
        } catch (e) {
            console.error("Error clearing cache: ", e);
        } finally {
            setLoading(false);
        }
    };

    const disabled = status || loading;

    return (
        <>
            <Flex>
                <CategoryActions />
                <Box
                    alignItems="center"
                    borderRadius={DIMENS.BORDER_RADIUS_L}
                    clickable={!disabled}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        disabled ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    onClick={handleClearCache}
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
                        Clear cache
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Other</Text>
        </>
    );
};

export default OtherActions;
