import React, { useState } from "react";

import { Icon } from "../common";
import { StopwordsModal } from "../modals";
import { useAppContext } from "../../hooks";
import { STATUS } from "../../res";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../styles";

const StopwordActions = () => {
    const { status } = useAppContext();

    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        if (status !== STATUS.RUNNING_MODEL) {
            setShowModal(true);
        }
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
                        name={ICON.STOPWORDS}
                        size={24}
                        style={{
                            marginBottom: "5px",
                        }}
                    />
                    <Text
                        center
                        color={
                            status === STATUS.RUNNING_MODEL
                                ? COLORS.GRAY_MEDIUM
                                : COLORS.BLACK
                        }
                        fontSize={FONT_SIZE.S}
                    >
                        Stopwords
                    </Text>
                </Box>
            </Flex>
            <StopwordsModal
                onClose={() => setShowModal(false)}
                open={showModal}
            />
        </>
    );
};

export default StopwordActions;
