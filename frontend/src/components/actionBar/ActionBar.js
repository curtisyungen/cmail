import React from "react";

import AnalysisActions from "./AnalysisActions";
import EmailsActions from "./EmailsActions";
import FeatureActions from "./FeatureActions";
import ModelActions from "./ModelActions";
import NamingActions from "./NamingActions";
import OtherActions from "./OtherActions";
import { BoxWithShadow } from "../common";
import { useAppContext } from "../../hooks";
import { TABS } from "../../res";
import { Box, COLORS, DIMENS, Flex } from "../../styles";

const Divider = () => {
    return (
        <Box
            background={COLORS.BORDER}
            height={DIMENS.ACTION_BAR_HEIGHT - 10}
            margin={{ left: 5, right: 5 }}
            style={{ maxWidth: "1px", minWidth: "1px" }}
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
    const { tab } = useAppContext();
    return (
        <Box padding={{ left: DIMENS.SPACING_STANDARD }}>
            <BoxWithShadow
                height={DIMENS.ACTION_BAR_HEIGHT}
                padding={{ left: 5 }}
            >
                <Flex>
                    {tab === TABS.MODEL ? (
                        <>
                            <Section>
                                <ModelActions />
                            </Section>
                            <Divider />
                            <Section>
                                <FeatureActions />
                            </Section>
                            <Divider />
                            <Section>
                                <NamingActions />
                            </Section>
                        </>
                    ) : (
                        <></>
                    )}
                    {tab === TABS.DATA ? (
                        <>
                            <Section>
                                <EmailsActions />
                            </Section>
                            <Divider />
                            <Section>
                                <AnalysisActions />
                            </Section>
                            <Divider />
                            <Section>
                                <OtherActions />
                            </Section>
                        </>
                    ) : (
                        <></>
                    )}
                </Flex>
            </BoxWithShadow>
        </Box>
    );
};

export default ActionBar;
