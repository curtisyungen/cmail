import React from "react";

import { Box, COLORS } from "../../styles";

const HEIGHT = 16;
const WIDTH = 32;

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
            style={{
                cursor: "pointer",
                maxHeight: HEIGHT,
                minHeight: HEIGHT,
                maxWidth: WIDTH,
                minWidth: WIDTH,
                overflow: "hidden",
            }}
            width={WIDTH}
        >
            <Box
                clickable
                hoverBackground={
                    enabled ? COLORS.BLUE_DARK : COLORS.GRAY_MEDIUM
                }
                height="100%"
                style={{
                    bottom: 0,
                    left: enabled ? WIDTH - HEIGHT : 0,
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
                    height={HEIGHT - 1}
                    style={{ cursor: "pointer" }}
                    width={HEIGHT - 2}
                />
            </Box>
        </Box>
    );
};

export default Switch;
