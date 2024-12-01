import React, { useState } from "react";

import { Icon } from "./common";
import { ICON } from "../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../styles";

const TABS = {
    HOME: "Home",
    ABOUT: "About",
};

const SelectionIndicator = ({ active }) => {
    return (
        <Box
            background={active ? COLORS.BLUE_DARK : COLORS.TRANSPARENT}
            borderRadius={5}
            height={3}
            margin={{ top: 2 }}
            width="100%"
        />
    );
};

const Navbar = () => {
    const [selectedTab, setSelectedTab] = useState(TABS.HOME);

    return (
        <Box
            height={DIMENS.NAVBAR_HEIGHT}
            padding={{ left: 15, right: 20, top: 5 }}
        >
            <Flex alignItems="center" justifyContent="flex-start">
                <Box margin={{ bottom: 6, right: 8 }} style={{ flex: 0 }}>
                    <Icon color={COLORS.BLACK} name={ICON.MENU} />
                </Box>
                {Object.values(TABS).map((tab, idx) => (
                    <Box
                        key={idx}
                        alignItems="center"
                        borderRadius={2}
                        clickable
                        hoverBackground={COLORS.GRAY_LIGHT2}
                        margin={{ bottom: 5, left: 8 }}
                        onClick={() => setSelectedTab(tab)}
                        padding={5}
                        width={50}
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
