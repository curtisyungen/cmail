import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import { Box, Flex, FONT_SIZE, Text } from "../../styles";

const ScoreModal = ({ onClose, open }) => {
    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            style={{
                content: {
                    height: "fit-content",
                    margin: "auto",
                    userSelect: "none",
                },
            }}
        >
            <Box>
                <Text bold fontSize={FONT_SIZE.XL}>
                    Score
                </Text>
                <Text></Text>
            </Box>
        </Modal>
    );
};

export default ScoreModal;
