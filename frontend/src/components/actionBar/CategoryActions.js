import React, { useState } from "react";

import { Icon } from "../common";
import { CategoryModal } from "../modals";
import { useAppActions, useAppContext } from "../../hooks";
import { LS, STATUS } from "../../res";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";
import { SortUtils, StorageUtils } from "../../utils";

const CategoryActions = () => {
    const { categories, ldaConfig, status } = useAppContext();
    const { setCategories, setLdaConfig } = useAppActions();

    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        if (status !== STATUS.RUNNING_KMEANS) {
            setShowModal(true);
        }
    };

    const handleAdd = (category) => {
        saveCategories([...categories, category]);
    };

    const handleDelete = (index) => {
        saveCategories(categories.filter((_, idx) => idx !== index));
    };

    const handleToggle = () => {
        setLdaConfig({
            ...ldaConfig,
            use_categories: !ldaConfig.use_categories,
        });
    };

    const saveCategories = (categories) => {
        categories = SortUtils.sortData({ data: categories, key: "name" });
        StorageUtils.setItem(LS.CATEGORIES, categories);
        setCategories(categories);
    };

    return (
        <>
            <Flex>
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={status !== STATUS.RUNNING_KMEANS}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        status ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    onClick={handleClick}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={
                            status === STATUS.RUNNING_KMEANS
                                ? COLORS.GRAY_MEDIUM
                                : COLORS.BLUE_DARK
                        }
                        name={ICON.CATEGORY}
                        size={24}
                        style={{ marginBottom: "5px" }}
                    />
                    {!ldaConfig.use_categories ? (
                        <Box
                            style={{
                                left: 7,
                                position: "absolute",
                            }}
                        >
                            <Icon
                                color={COLORS.RED}
                                name={ICON.BAN}
                                size={14}
                            />
                        </Box>
                    ) : (
                        <></>
                    )}
                    <Text
                        center
                        color={
                            status === STATUS.RUNNING_KMEANS
                                ? COLORS.GRAY_MEDIUM
                                : COLORS.BLUE_DARK
                        }
                        fontSize={FONT_SIZE.S}
                    >
                        Categories
                    </Text>
                </Box>
            </Flex>

            <CategoryModal
                categories={categories}
                ldaConfig={ldaConfig}
                onClose={() => setShowModal(false)}
                onDelete={handleDelete}
                onSave={handleAdd}
                onToggle={handleToggle}
                open={showModal}
            />
        </>
    );
};

export default CategoryActions;
