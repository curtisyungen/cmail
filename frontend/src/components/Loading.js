import React from "react";
import styled, { keyframes } from "styled-components";

import logo from "../assets/logo.png";
import { useAppActions, useAppContext } from "../hooks";
import { APP_NAME } from "../res";
import { Box, COLORS, FONT_SIZE, Text } from "../styles";

const DELAY = 2000; // ms
const LOGO_SIZE = "150px";

const moveUp = keyframes`
  0% {
    transform: translateY(${LOGO_SIZE});
  }
  100% {
    transform: translateY(0px);
  }
`;

const AnimatedBox = styled(Box)`
    align-items: center;
    animation: ${moveUp} 500ms linear forwards;
    justify-content: center;
    height: ${LOGO_SIZE};
    margin: auto;
    width: ${LOGO_SIZE};
`;

const Loading = () => {
    const { showLoading } = useAppContext();
    const { setShowLoading } = useAppActions();

    const handleAnimationEnd = () => {
        setTimeout(() => setShowLoading(false), DELAY);
    };

    if (!showLoading) {
        return null;
    }

    return (
        <Box
            background={COLORS.GRAY_LIGHT_3}
            height="100vh"
            style={{
                bottom: "0px",
                left: "0px",
                position: "fixed",
                right: "0px",
                top: "0px",
            }}
        >
            <Box
                background={COLORS.WHITE}
                height={500}
                margin="auto"
                width={550}
            >
                <Box background={COLORS.WHITE} style={{ overflow: "hidden" }}>
                    <AnimatedBox
                        alignItems="center"
                        center
                        onAnimationEnd={handleAnimationEnd}
                    >
                        <img
                            alt="Logo"
                            src={logo}
                            style={{ height: LOGO_SIZE, width: LOGO_SIZE }}
                        />
                    </AnimatedBox>
                </Box>
                <Box style={{ bottom: 20, position: "absolute" }}>
                    <Text
                        center
                        color={COLORS.GRAY_DARK}
                        fontSize={FONT_SIZE.XL}
                        semibold
                    >
                        {APP_NAME}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};

export default Loading;
