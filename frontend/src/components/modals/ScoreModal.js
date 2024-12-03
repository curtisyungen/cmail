import React from "react";
import Modal from "react-modal";

import { Box, COLORS, Flex, FONT_SIZE, Text } from "../../styles";

Modal.setAppElement("#root");

const ScoreSection = ({ title, description, color }) => {
    return (
        <Box margin={{ top: 10 }}>
            <Flex alignItems="center">
                <Box margin={{ right: 5 }} width={100}>
                    <Text bold color={color} fontSize={FONT_SIZE.L}>
                        {title}
                    </Text>
                </Box>
                <Text>{description}</Text>
            </Flex>
        </Box>
    );
};

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
                    width: "420px",
                },
            }}
        >
            <Box>
                <Text bold fontSize={FONT_SIZE.XL}>
                    Score
                </Text>
                <Box margin={{ top: 10 }}>
                    <Text bold>Silhouette Score</Text>
                </Box>
                <Box margin={{ top: 10 }}>
                    <Text>
                        Used in K-means for measuring the separation of
                        clusters.
                    </Text>
                    <ScoreSection
                        color={COLORS.GREEN}
                        description="Very well-separated and distinct clusters"
                        title="Above 0.75"
                    />
                    <ScoreSection
                        color={COLORS.YELLOW}
                        description="Reasonably strong clusters"
                        title="0.50 - 0.75"
                    />
                    <ScoreSection
                        color={COLORS.ORANGE}
                        description="Some clustering but clusters overlap and aren't very
                        distinct"
                        title="0.25 - 0.50"
                    />
                    <ScoreSection
                        color={COLORS.RED}
                        description="Poor clustering"
                        title="Below 0.25"
                    />
                </Box>
            </Box>
        </Modal>
    );
};

export default ScoreModal;
