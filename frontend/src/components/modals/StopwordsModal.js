import React, { useState } from "react";
import Modal from "react-modal";

import { Icon } from "../common";
import { useAppActions, useAppContext } from "../../hooks";
import { LS } from "../../res";
import { ICON } from "../../res/icons";
import { Box, Button, COLORS, Flex, FONT_SIZE, Text } from "../../styles";
import { SortUtils, StorageUtils } from "../../utils";

Modal.setAppElement("#root");

const StopwordsModal = ({ onClose, open }) => {
    const { stopwords } = useAppContext();
    const { setStopwords } = useAppActions();

    const [newWords, setNewWords] = useState("");

    const handleClearAll = () => {
        if (window.confirm("Clear all stopwords?")) {
            setStopwords([]);
            StorageUtils.setItem(LS.STOPWORDS, []);
        }
    };

    const handleClose = () => {
        setNewWords("");
        onClose();
    };

    const handleDelete = (stopword) => {
        setStopwords(stopwords.filter((word) => word !== stopword));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveStopwords();
        }
    };

    const handleInputChange = (e) => {
        setNewWords(e.target.value);
    };

    const saveStopwords = () => {
        const updatedStopwords = new Set(
            newWords
                .split(",")
                .map((word) => word.trim())
                .concat(stopwords)
        );
        const sortedStopwords = SortUtils.sortData({
            data: Array.from(updatedStopwords),
        });
        StorageUtils.setItem(LS.STOPWORDS, sortedStopwords);
        setStopwords(sortedStopwords);
        setNewWords("");
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
                <Text fontSize={FONT_SIZE.XL}>Stopwords</Text>
                <Text fontSize={FONT_SIZE.S} style={{ marginTop: "5px" }}>
                    Stopwords will be filtered out of data during preprocessing.
                </Text>
            </Box>
            <Box margin={{ top: 15 }}>
                <Text>{`Add words (case insensitive)`}</Text>
                <textarea
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Add words separated by commas, i.e. Gmail, best regards, thank you"
                    style={{
                        fontSize: FONT_SIZE.M,
                        marginTop: "5px",
                        padding: "8px",
                    }}
                    value={newWords}
                />
            </Box>
            <Box margin={{ top: 10 }}>
                <Flex justifyContent="flex-end" style={{ marginTop: "10px" }}>
                    <Button
                        disabled={newWords.trim().length === 0}
                        onClick={saveStopwords}
                        style={{ marginRight: "10px" }}
                    >
                        Save
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                </Flex>
            </Box>
            {stopwords.length > 0 ? (
                <>
                    <Box
                        background={COLORS.BORDER}
                        height={1}
                        margin={{ top: 10 }}
                        style={{ flex: 1 }}
                    />
                    <Box padding={{ top: 10 }}>
                        <Box
                            clickable
                            margin={{ bottom: 10 }}
                            onClick={handleClearAll}
                            width="fit-content"
                        >
                            <Text
                                color={COLORS.GRAY_DARK}
                                fontSize={FONT_SIZE.M}
                            >
                                Clear all
                            </Text>
                        </Box>
                        <Flex flexWrap>
                            {stopwords.map((word, idx) => (
                                <Box
                                    key={idx}
                                    borderRadius={12}
                                    borderWidth={1}
                                    hoverBackground={COLORS.GRAY_LIGHT}
                                    margin={{ bottom: 3, right: 3 }}
                                    padding="4px 6px"
                                    style={{ maxWidth: "100px" }}
                                    width="fit-content"
                                >
                                    <Flex alignItems="center">
                                        <Text style={{ lineHeight: 1 }}>
                                            {word}
                                        </Text>
                                        <Box
                                            clickable
                                            margin={{ left: 5 }}
                                            onClick={() => handleDelete(word)}
                                            width={12}
                                        >
                                            <Icon
                                                color={COLORS.GRAY_DARK}
                                                name={ICON.CLOSE}
                                                size={12}
                                            />
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}
                        </Flex>
                    </Box>
                </>
            ) : (
                <></>
            )}
        </Modal>
    );
};

export default StopwordsModal;
