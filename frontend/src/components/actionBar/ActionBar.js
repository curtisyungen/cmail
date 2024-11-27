import React from "react";

import DataActions from "./DataActions";
import KMeansActions from "./KMeansActions";
import LdaActions from "./LdaActions";
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

const ActionBar = ({
    activeAction,
    setActiveAction,
    setEmailTopics,
    setTopics,
}) => {
    return (
        <Box
            background={COLORS.WHITE}
            borderRadius={5}
            height={DIMENS.ACTION_BAR_HEIGHT}
            padding={{ left: 5 }}
        >
            <Flex>
                <Section>
                    <KMeansActions
                        activeAction={activeAction}
                        setActiveAction={setActiveAction}
                        setTopics={setTopics}
                        setEmailTopics={setEmailTopics}
                    />
                </Section>
                <Divider />
                <Section>
                    <LdaActions
                        activeAction={activeAction}
                        setActiveAction={setActiveAction}
                    />
                </Section>
                <Divider />
                <Section>
                    <DataActions />
                </Section>
            </Flex>
        </Box>
    );
};

export default ActionBar;
