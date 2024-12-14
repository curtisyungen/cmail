import React, { useState } from "react";

import StopwordActions from "./StopwordActions";
import { Icon } from "../common";
import { useApi, useAppActions } from "../../hooks";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";
import { StorageUtils } from "../../utils";
import { LS, STATUS } from "../../res";
import { useAppContext } from "../../AppContext";

const OtherActions = () => {
    const { clearEmailsFromRedis } = useApi();
    const { setEmails, setEmailToTopicIdMap, setModelResult, setTopics } =
        useAppActions();
    const { status } = useAppContext();

    const [loading, setLoading] = useState(false);

    const handleClearCache = async () => {
        try {
            setLoading(true);
            StorageUtils.removeItem(LS.CLUSTERS);
            StorageUtils.removeItem(LS.EMAIL_CLUSTERS);
            StorageUtils.removeItem(LS.MODEL_RESULT);
            await clearEmailsFromRedis();
            setEmails([]);
            setEmailToTopicIdMap({});
            setModelResult({});
            setTopics([]);
        } catch (e) {
            console.error("Error clearing cache: ", e);
        } finally {
            setLoading(false);
        }
    };

    const disabled = status === STATUS.RUNNING_MODEL || loading;

    return (
        <>
            <Flex>
                <StopwordActions />
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
