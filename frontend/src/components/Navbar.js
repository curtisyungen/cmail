import React from "react";

import { Icon } from "./common";
import { useAppActions, useAppContext } from "../hooks";
import { TABS } from "../res";
import { ICON } from "../res/icons";
import { Box, COLORS, DIMENS, Flex, Text } from "../styles";

const SelectionIndicator = ({ active }) => {
    return (
        <Box
            background={active ? COLORS.BLUE_DARK : COLORS.TRANSPARENT}
            borderRadius={DIMENS.BORDER_RADIUS_L}
            clickable
            height={3}
            margin={{ top: 2 }}
            width="100%"
        />
    );
};

const Navbar = () => {
    const { showNavigationPane, tab: selectedTab } = useAppContext();
    const { setShowNavigationPane, setTab } = useAppActions();

    return (
        <Box
            height={DIMENS.NAVBAR_HEIGHT}
            padding={{ left: 15, right: 20, top: 5 }}
            style={{ userSelect: "none" }}
        >
            <Flex alignItems="center" justifyContent="flex-start">
                <Box
                    borderRadius={DIMENS.BORDER_RADIUS_S}
                    clickable
                    height="100%"
                    hoverBackground={COLORS.GRAY_LIGHT2}
                    margin={{ bottom: 5, left: 8, top: 5 }}
                    padding={5}
                    onClick={() => setShowNavigationPane(!showNavigationPane)}
                    style={{ flex: 0 }}
                >
                    <Icon color={COLORS.BLACK} name={ICON.MENU} />
                </Box>
                {Object.values(TABS).map((tab, idx) => (
                    <Box
                        key={idx}
                        alignItems="center"
                        borderRadius={DIMENS.BORDER_RADIUS_S}
                        clickable
                        height="100%"
                        hoverBackground={COLORS.GRAY_LIGHT2}
                        margin={{ bottom: 5, left: 8, top: 5 }}
                        onClick={() => setTab(tab)}
                        padding={5}
                        width={DIMENS.TAB_WIDTH}
                    >
                        <Text bold={selectedTab === tab}>{tab}</Text>
                        <SelectionIndicator active={selectedTab === tab} />
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

export default Navbar;
