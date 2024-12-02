import React, { useState } from "react";
import Modal from "react-modal";

import { Icon, Switch } from "../common";
import { useAppActions, useAppContext } from "../../hooks";
import { LS, STATUS } from "../../res";
import { ICON } from "../../res/icons";
import {
    Box,
    Button,
    CATEGORY_COLORS,
    COLORS,
    DIMENS,
    Flex,
    FONT_SIZE,
    Text,
} from "../../styles";
import { SortUtils, StorageUtils } from "../../utils";

Modal.setAppElement("#root");

const CategoryModal = ({
    categories,
    ldaConfig,
    onClose,
    onDelete,
    onSave,
    onToggle,
    open,
}) => {
    const [newColor, setNewColor] = useState(COLORS.RED);
    const [newCategory, setNewCategory] = useState("");

    const disabled = !ldaConfig.use_categories;

    const handleClose = () => {
        setNewCategory("");
        setNewColor(COLORS.RED);
        onClose();
    };

    const handleSave = () => {
        onSave({ name: newCategory, color: newColor });
        setNewCategory("");
        setNewColor(COLORS.RED);
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
                    width: "420px",
                },
            }}
        >
            <Box>
                <Flex justifyContent="space-between">
                    <Text fontSize={FONT_SIZE.XL}>Create new category</Text>
                    <Flex>
                        <Text style={{ marginRight: "8px" }}>
                            {ldaConfig.use_categories ? "Enabled" : "Disabled"}
                        </Text>
                        <Switch
                            enabled={ldaConfig.use_categories}
                            onClick={onToggle}
                        />
                    </Flex>
                </Flex>
                <Text fontSize={FONT_SIZE.S} style={{ marginTop: "5px" }}>
                    {disabled
                        ? "Categories will not be used for LDA."
                        : "Categories will be used for LDA naming of clusters."}
                </Text>
            </Box>
            <Box margin={{ top: 15 }}>
                <Text disabled={disabled}>Name</Text>
                <input
                    disabled={disabled}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Name your category"
                    style={{
                        fontSize: FONT_SIZE.M,
                        marginTop: "5px",
                        padding: "8px",
                    }}
                    value={newCategory}
                />
            </Box>
            <Box margin={{ top: 10 }}>
                <Text disabled={disabled}>Color</Text>
                <Flex>
                    {CATEGORY_COLORS.map((color, idx) => (
                        <Box
                            key={idx}
                            alignItems="center"
                            background={disabled ? COLORS.GRAY_LIGHT : color}
                            borderColor={
                                disabled ? COLORS.GRAY_DARK : COLORS.BLACK
                            }
                            borderRadius={25}
                            borderWidth={
                                !disabled && newColor === color ? 2 : 1
                            }
                            clickable
                            height={25}
                            margin={3}
                            onClick={() => setNewColor(color)}
                            style={{ opacity: newColor === color ? 1 : 0.85 }}
                            transition={0}
                            width={25}
                        >
                            <Text
                                bold={!disabled && newColor === color}
                                center
                                color={COLORS.BLACK}
                                disabled={disabled}
                            >
                                A
                            </Text>
                        </Box>
                    ))}
                </Flex>
                <Flex justifyContent="flex-end" style={{ marginTop: "10px" }}>
                    <Button
                        disabled={newCategory.length === 0 || disabled}
                        onClick={handleSave}
                        style={{ marginRight: "10px" }}
                    >
                        Save
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                </Flex>
            </Box>
            <Box
                background={COLORS.BORDER}
                height={1}
                margin={{ bottom: 10, top: 10 }}
                style={{ flex: 1 }}
            />
            <Box margin={{ top: 10 }}>
                <Flex flexWrap>
                    {categories.map(({ color, name }, idx) => (
                        <Box
                            key={idx}
                            margin={5}
                            style={{ flex: 1 }}
                            width={130}
                        >
                            <Flex justifyContent="space-between">
                                <Flex style={{ width: "130px" }}>
                                    <Icon
                                        color={color}
                                        disabled={disabled}
                                        name={ICON.CATEGORY}
                                        size={14}
                                        style={{ marginRight: "5px" }}
                                    />
                                    <Text disabled={disabled}>{name}</Text>
                                </Flex>
                                <Box
                                    clickable
                                    onClick={() => onDelete(idx)}
                                    width={20}
                                >
                                    <Icon
                                        color={COLORS.GRAY_DARK}
                                        disabled={disabled}
                                        name={ICON.TRASH}
                                        size={14}
                                    />
                                </Box>
                            </Flex>
                        </Box>
                    ))}
                </Flex>
            </Box>
        </Modal>
    );
};

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
