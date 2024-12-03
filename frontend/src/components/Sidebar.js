import React from "react";

import { Icon } from "./common";
import { ICON } from "../res/icons";
import { Box, COLORS, DIMENS, Flex } from "../styles";

const SelectionIndicator = ({ active }) => {
    return (
        <Box
            background={active ? COLORS.BLUE_DARK : COLORS.TRANSPARENT}
            borderRadius={5}
            height={24}
            style={{ left: 0, position: "absolute" }}
            width={3}
        />
    );
};

const SidebarItem = ({ color, icon, selected }) => {
    return (
        <Box alignItems="center" height={38}>
            <Flex>
                <SelectionIndicator active={selected} />
                <Icon color={color} name={icon} />
            </Flex>
        </Box>
    );
};

const Sidebar = () => {
    return (
        <Box
            background={COLORS.SIDEBAR}
            height="100%"
            justifyContent="flex-start"
            style={{ minWidth: DIMENS.SIDEBAR_WIDTH }}
            width={DIMENS.SIDEBAR_WIDTH}
        >
            <SidebarItem icon={ICON.MAIL} selected={true} />
            <SidebarItem icon={ICON.CALENDAR} />
            <SidebarItem icon={ICON.USERS} />
            <SidebarItem icon={ICON.CHECK} />
            <SidebarItem icon={ICON.NEWS} />
            <SidebarItem icon={ICON.NETWORK} />
            <SidebarItem icon={ICON.CLOUD} />
            <SidebarItem color={COLORS.PURPLE} icon={ICON.STROOP} />
            <SidebarItem color={COLORS.GRAY_DARK} icon={ICON.TABLE} />
        </Box>
    );
};

export default Sidebar;
