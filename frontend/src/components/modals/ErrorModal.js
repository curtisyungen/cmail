import React from "react";
import Modal from "react-modal";

import { Icon } from "../common";
import { useAppActions, useAppContext } from "../../hooks";
import { ICON } from "../../res/icons";
import { Box, Button, COLORS, Flex, FONT_SIZE, Text } from "../../styles";

Modal.setAppElement("#root");

const ErrorModal = ({ hasError, onClose }) => {
    const { error } = useAppContext();
    const { setError } = useAppActions();

    const handleClose = () => {
        onClose();
        setError(null);
    };

    return (
        <Modal
            isOpen={error || hasError}
            onRequestClose={handleClose}
            style={{
                content: {
                    height: "fit-content",
                    margin: "auto",
                    userSelect: "none",
                    width: "300px",
                },
            }}
        >
            <Box>
                <Flex>
                    <Icon
                        color={COLORS.RED}
                        name={ICON.WARNING}
                        size={28}
                        style={{ marginRight: "10px" }}
                    />
                    <Text bold fontSize={FONT_SIZE.XXL}>
                        Error
                    </Text>
                </Flex>
                <Box padding={20}>
                    <Text center>An error occurred.</Text>
                </Box>
                <Box alignItems="center">
                    <Button onClick={handleClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ErrorModal;
