import React, { useState } from "react";
import Modal from "react-modal";

import { Icon, Switch } from "../common";
import { ICON } from "../../res/icons";
import {
    Box,
    Button,
    CATEGORY_COLORS,
    COLORS,
    Flex,
    FONT_SIZE,
    OPACITY,
    Text,
} from "../../styles";

Modal.setAppElement("#root");

const CategoryModal = ({
    categories,
    namingConfig,
    onClose,
    onDelete,
    onSave,
    onToggle,
    open,
}) => {
    const [newColor, setNewColor] = useState(COLORS.RED);
    const [newCategory, setNewCategory] = useState("");

    const disabled = !namingConfig.use_categories;

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
                            {namingConfig.use_categories
                                ? "Enabled"
                                : "Disabled"}
                        </Text>
                        <Switch
                            enabled={namingConfig.use_categories}
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
                            style={{
                                opacity:
                                    newColor === color
                                        ? OPACITY.NORMAL
                                        : OPACITY.LIGHT,
                            }}
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

export default CategoryModal;
