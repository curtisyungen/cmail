import React from "react";

import { Box, COLORS } from "../../styles";

const HEIGHT = 18;
const WIDTH = 36;

const Switch = ({ enabled, onClick }) => {
    return (
        <Box
            background={enabled ? COLORS.BLUE_DARK : COLORS.GRAY_LIGHT}
            borderColor={COLORS.GRAY_DARK}
            borderRadius={HEIGHT / 2}
            borderWidth={1}
            clickable
            height={HEIGHT}
            onClick={onClick}
            style={{ cursor: "pointer", overflow: "hidden" }}
            width={WIDTH}
        >
            <Box
                clickable
                hoverBackground={
                    enabled ? COLORS.BLUE_DARK : COLORS.GRAY_MEDIUM
                }
                style={{
                    bottom: 0,
                    left: enabled ? WIDTH - HEIGHT + 1 : 0,
                    position: "absolute",
                    top: 0,
                }}
                transition="0.25s"
            >
                <Box
                    background={COLORS.WHITE}
                    borderColor={COLORS.GRAY_DARK}
                    borderRadius={HEIGHT / 2}
                    borderWidth={1}
                    clickable
                    height={HEIGHT - 2}
                    style={{ cursor: "pointer" }}
                    width={HEIGHT - 2}
                />
            </Box>
        </Box>
    );
};

export default Switch;
