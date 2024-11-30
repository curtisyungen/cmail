import React, { useState } from "react";
import Modal from "react-modal";

import { Icon } from "../common";
import { useAppActions, useAppContext } from "../../hooks";
import { LS } from "../../res";
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

const CategoryModal = ({ categories, onClose, onDelete, onSave, open }) => {
    const [newColor, setNewColor] = useState(COLORS.RED);
    const [newCategory, setNewCategory] = useState("");

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
                <Text fontSize={FONT_SIZE.XL}>Create new category</Text>
            </Box>
            <Box margin={{ top: 10 }}>
                <Text>Name</Text>
                <input
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
                <Text>Color</Text>
                <Flex>
                    {CATEGORY_COLORS.map((color, idx) => (
                        <Box
                            key={idx}
                            alignItems="center"
                            background={color}
                            borderColor={COLORS.BLACK}
                            borderRadius={25}
                            borderWidth={newColor === color ? 2 : 1}
                            clickable
                            height={25}
                            margin={3}
                            onClick={() => setNewColor(color)}
                            style={{ opacity: newColor === color ? 1 : 0.85 }}
                            transition={0}
                            width={25}
                        >
                            <Text
                                bold={newColor === color}
                                center
                                color={COLORS.BLACK}
                            >
                                A
                            </Text>
                        </Box>
                    ))}
                </Flex>
                <Flex justifyContent="flex-end" style={{ marginTop: "10px" }}>
                    <Button
                        disabled={newCategory.length === 0}
                        onClick={handleSave}
                        style={{ marginRight: "10px" }}
                    >
                        Save
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
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
                                        name={ICON.CATEGORY}
                                        size={14}
                                        style={{ marginRight: "5px" }}
                                    />
                                    <Text>{name}</Text>
                                </Flex>
                                <Box
                                    clickable
                                    onClick={() => onDelete(idx)}
                                    width={20}
                                >
                                    <Icon
                                        color={COLORS.GRAY_DARK}
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

const CategoryActions = ({ isRunning }) => {
    const { categories } = useAppContext();
    const { setCategories } = useAppActions();

    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        if (!isRunning) {
            setShowModal(true);
        }
    };

    const handleAdd = (category) => {
        saveCategories([...categories, category]);
    };

    const handleDelete = (index) => {
        saveCategories(categories.filter((_, idx) => idx !== index));
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
                    clickable={!isRunning}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        isRunning ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    onClick={handleClick}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={
                            isRunning ? COLORS.GRAY_MEDIUM : COLORS.BLUE_DARK
                        }
                        name={ICON.CATEGORY}
                        size={24}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text center fontSize={FONT_SIZE.S}>
                        Categories
                    </Text>
                </Box>
            </Flex>

            <CategoryModal
                categories={categories}
                onClose={() => setShowModal(false)}
                onDelete={handleDelete}
                onSave={handleAdd}
                open={showModal}
            />
        </>
    );
};

export default CategoryActions;
