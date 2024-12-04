import React, { useEffect, useState } from "react";

import { ClusterChart, ElbowChart, KeywordChart, ScoreModal } from "../modals";
import { Icon } from "../common";
import { useAppContext } from "../../hooks";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";

const MODAL = {
    CLUSTER: "CLUSTER",
    ELBOW: "ELBOW",
    KEYWORDS: "KEYWORDS",
    SCORE: "SCORE",
};

const Option = ({ disabled, icon, name, onClick, title }) => {
    const handleClick = () => {
        if (disabled) {
            return;
        }
        onClick(name);
    };

    return (
        <Box
            alignItems="center"
            borderRadius={5}
            clickable={!disabled}
            height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
            hoverBackground={disabled ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT}
            margin={{ right: DIMENS.SPACING_STANDARD }}
            onClick={handleClick}
            style={{ flex: 1 }}
            width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
        >
            <Icon
                color={disabled ? COLORS.GRAY_MEDIUM : COLORS.BLUE_DARK}
                name={icon}
                size={24}
                style={{ marginBottom: "5px" }}
            />
            <Text center disabled={disabled} fontSize={FONT_SIZE.S}>
                {title}
            </Text>
        </Box>
    );
};

const AnalysisActions = () => {
    const { modelResult, status } = useAppContext();
    const {
        clusters_data,
        elbow_data,
        keyword_counts,
        silhouette_score: ss,
    } = modelResult;

    const [activeModal, setActiveModal] = useState(null);
    const [scoreColor, setScoreColor] = useState(COLORS.GRAY_MEDIUM);

    const disabled = status || !clusters_data || clusters_data.length === 0;

    useEffect(() => {
        let color;
        switch (true) {
            case disabled:
                color = COLORS.GRAY_MEDIUM;
                break;
            case ss <= 0.25:
                color = COLORS.RED;
                break;
            case ss <= 0.5:
                color = COLORS.ORANGE;
                break;
            case ss <= 0.75:
                color = COLORS.YELLOW;
                break;
            case ss <= 1:
                color = COLORS.GREEN;
                break;
            default:
                color = COLORS.GRAY_MEDIUM;
        }
        setScoreColor(color);
    }, [ss]);

    const handleOpenModal = (modal) => {
        setActiveModal(disabled ? null : modal);
    };

    return (
        <>
            <Flex>
                <Option
                    disabled={
                        disabled ||
                        !keyword_counts ||
                        keyword_counts.length === 0
                    }
                    icon={ICON.BAR_CHART}
                    name={MODAL.KEYWORDS}
                    onClick={handleOpenModal}
                    title="Keywords"
                />
                <Option
                    disabled={
                        disabled ||
                        !elbow_data ||
                        Object.keys(elbow_data).length === 0
                    }
                    icon={ICON.ELBOW}
                    name={MODAL.ELBOW}
                    onClick={handleOpenModal}
                    title="Elbow"
                />
                <Option
                    disabled={disabled}
                    icon={ICON.CHART}
                    name={MODAL.CLUSTER}
                    onClick={handleOpenModal}
                    title="Clusters"
                />
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={!disabled}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        disabled ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    onClick={() => handleOpenModal(MODAL.SCORE)}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Box
                        clickable={!disabled}
                        height={24}
                        margin={{ bottom: 5 }}
                    >
                        <Text
                            center
                            color={scoreColor}
                            fontSize={FONT_SIZE.XXL}
                        >
                            {isNaN(ss) ? "N/A" : Math.round(ss * 100) / 100}
                        </Text>
                    </Box>
                    <Text center disabled={disabled} fontSize={FONT_SIZE.S}>
                        Score
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Analysis</Text>

            <KeywordChart
                onClose={() => setActiveModal(null)}
                open={activeModal === MODAL.KEYWORDS}
            />
            <ElbowChart
                onClose={() => setActiveModal(null)}
                open={activeModal === MODAL.ELBOW}
            />
            <ClusterChart
                onClose={() => setActiveModal(null)}
                open={activeModal === MODAL.CLUSTER}
            />
            <ScoreModal
                onClose={() => setActiveModal(null)}
                open={activeModal === MODAL.SCORE}
            />
        </>
    );
};

export default AnalysisActions;
