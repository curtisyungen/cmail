import React, { useState } from "react";

import DataActions from "./DataActions";
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

const DEFAULT_NO_ABOVE = 50; // %
const DEFAULT_NO_BELOW = 2;

const ActionBar = ({
    activeAction,
    setActiveAction,
    setEmailTopics,
    setTopics,
}) => {
    const [ldaConfig, setLdaConfig] = useState({
        noBelow: DEFAULT_NO_BELOW,
        noAbove: DEFAULT_NO_ABOVE,
    });

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
                        ldaConfig={ldaConfig}
                        setEmailTopics={setEmailTopics}
                        setTopics={setTopics}
                    />
                </Section>
                <Divider />
                <Section>
                    <DataActions
                        activeAction={activeAction}
                        setActiveAction={setActiveAction}
                    />
                </Section>
                <Divider />
                <Section>
                    <LdaActions
                        activeAction={activeAction}
                        ldaConfig={ldaConfig}
                        setLdaConfig={setLdaConfig}
                    />
                </Section>
                <Divider />
                <Section>
                    <OtherActions activeAction={activeAction} />
                </Section>
            </Flex>
        </Box>
    );
};

export default ActionBar;
