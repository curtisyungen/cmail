import React, { useEffect, useState } from "react";

import CategoryActions from "./CategoryActions";
import { Icon } from "../common";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";
import { StorageUtils } from "../../utils";
import { LS } from "../../res";

const OtherActions = ({ activeAction, categories, setCategories }) => {
    const [hasCachedData, setHasCachedData] = useState(false);

    useEffect(() => {
        const cachedData = StorageUtils.getItem(LS.CLUSTERS);
        setHasCachedData(!!cachedData);
    }, []);

    const handleClearCache = () => {
        StorageUtils.clearAll();
        setHasCachedData(false);
    };

    return (
        <>
            <Flex>
                <CategoryActions
                    activeAction={activeAction}
                    categories={categories}
                    setCategories={setCategories}
                />
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={!activeAction && hasCachedData}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        activeAction || !hasCachedData
                            ? COLORS.TRANSPARENT
                            : COLORS.GRAY_LIGHT
                    }
                    onClick={handleClearCache}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={
                            activeAction || !hasCachedData
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
                            activeAction || !hasCachedData
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
