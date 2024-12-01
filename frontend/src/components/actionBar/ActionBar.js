import React, { useState } from "react";

import KMeansActions from "./KMeansActions";
import LdaActions from "./LdaActions";
import OtherActions from "./OtherActions";
import { Box, COLORS, DIMENS, Flex } from "../../styles";

const Divider = () => {
    return (
        <Box
            background={COLORS.BORDER}
            height={DIMENS.ACTION_BAR_HEIGHT - 10}
            margin={{ left: 5, right: 5 }}
            width={1}
        />
    );
};

const Section = ({ children }) => {
    return (
        <Box
            alignItems="center"
            height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
            padding={5}
            width="fit-content"
        >
            {children}
        </Box>
    );
};

const ActionBar = () => {
    const [isRunning, setIsRunning] = useState(false);
    return (
        <Box
            background={COLORS.WHITE}
            borderRadius={5}
            height={DIMENS.ACTION_BAR_HEIGHT}
            padding={{ left: 5 }}
            style={{
                boxShadow: `0px 1px 2px ${COLORS.GRAY_MEDIUM}`,
                userSelect: "none",
            }}
        >
            <Flex>
                <Section>
                    <KMeansActions
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                    />
                </Section>
                <Divider />
                <Section>
                    <LdaActions disabled={isRunning} />
                </Section>
                <Divider />
                <Section>
                    <OtherActions disabled={isRunning} />
                </Section>
            </Flex>
        </Box>
    );
};

export default ActionBar;
