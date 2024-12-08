import React, { useState } from "react";

import { Icon } from "../common";
import { CategoryModal } from "../modals";
import { useAppActions, useAppContext } from "../../hooks";
import { LS, STATUS } from "../../res";
import { ICON } from "../../res/icons";
import {
    Box,
    COLORS,
    DIMENS,
    Flex,
    FONT_SIZE,
    OPACITY,
    Text,
} from "../../styles";
import { SortUtils, StorageUtils } from "../../utils";

const CategoryActions = () => {
    const { categories, namingConfig, status } = useAppContext();
    const { setCategories, setNamingConfig } = useAppActions();

    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        if (status !== STATUS.RUNNING_MODEL) {
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
        setNamingConfig({
            ...namingConfig,
            use_categories: !namingConfig.use_categories,
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
                    borderRadius={DIMENS.BORDER_RADIUS_L}
                    clickable={status !== STATUS.RUNNING_MODEL}
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
                            status === STATUS.RUNNING_MODEL
                                ? COLORS.GRAY_MEDIUM
                                : COLORS.BLUE_DARK
                        }
                        name={ICON.CATEGORY}
                        size={24}
                        style={{
                            marginBottom: "5px",
                            opacity: namingConfig.use_categories
                                ? OPACITY.NORMAL
                                : OPACITY.LIGHT,
                        }}
                    />
                    {!namingConfig.use_categories ? (
                        <Box
                            center
                            clickable={status !== STATUS.RUNNING_MODEL}
                            style={{
                                left: 24,
                                position: "absolute",
                                top: 16,
                            }}
                        >
                            <Icon
                                color={COLORS.RED}
                                name={ICON.BAN}
                                size={12}
                            />
                        </Box>
                    ) : (
                        <></>
                    )}
                    <Text
                        center
                        color={
                            status === STATUS.RUNNING_MODEL
                                ? COLORS.GRAY_MEDIUM
                                : COLORS.BLACK
                        }
                        fontSize={FONT_SIZE.S}
                    >
                        Categories
                    </Text>
                </Box>
            </Flex>

            <CategoryModal
                categories={categories}
                namingConfig={namingConfig}
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
