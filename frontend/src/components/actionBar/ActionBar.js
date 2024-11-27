import React from "react";

import DataActions from "./DataActions";
import KMeansActions from "./KMeansActions";
import LdaActions from "./LdaActions";
import { Box, COLORS, DIMENS, Flex } from "../../styles";

const Divider = () => {
    return (
        <Box
            background={COLORS.BORDER}
            height={DIMENS.HEADER_HEIGHT - 10}
            margin={{ left: 5, right: 5 }}
            width={1}
        />
    );
};

const Section = ({ children }) => {
    return (
        <Box
            alignItems="center"
            height={DIMENS.HEADER_SECTION_HEIGHT}
            padding={5}
            width="fit-content"
        >
            {children}
        </Box>
    );
};

const Header = ({
    activeAction,
    setClusters,
    setEmailClusters,
    setActiveAction,
}) => {
    return (
        <Box
            background={COLORS.WHITE}
            borderRadius={5}
            height={DIMENS.HEADER_HEIGHT}
            padding={{ left: 5 }}
        >
            <Flex>
                <Section>
                    <KMeansActions
                        activeAction={activeAction}
                        setActiveAction={setActiveAction}
                        setClusters={setClusters}
                        setEmailClusters={setEmailClusters}
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

export default Header;
