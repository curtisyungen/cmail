import React from "react";

import AnalysisActions from "./AnalysisActions";
import EmailsActions from "./EmailsActions";
import FeatureActions from "./FeatureActions";
import ModelActions from "./ModelActions";
import NamingActions from "./NamingActions";
import OtherActions from "./OtherActions";
import { useAppContext } from "../../hooks";
import { TABS } from "../../res";
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
    const { tab } = useAppContext();
    return (
        <Box
            background={COLORS.WHITE}
            borderRadius={5}
            height={DIMENS.ACTION_BAR_HEIGHT}
            margin={{ left: 10 }}
            padding={{ left: 5 }}
            style={{
                boxShadow: `0px 1px 2px ${COLORS.GRAY_MEDIUM}`,
                userSelect: "none",
                width: "calc(100% - 10px)",
            }}
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
        </Box>
    );
};

export default ActionBar;
