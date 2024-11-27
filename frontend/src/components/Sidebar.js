import React from "react";

import { Icon } from "./common";
import { Box, COLORS, DIMENS } from "../styles";
import { ICON } from "../res/icons";

const SidebarItem = ({ color, icon }) => {
    return (
        <Box alignItems="center" height={38}>
            <Icon color={color} name={icon} />
        </Box>
    );
};

const Sidebar = () => {
    return (
        <Box
            background={COLORS.SIDEBAR}
            height="100%"
            justifyContent="flex-start"
            width={DIMENS.SIDEBAR_WIDTH}
        >
            <SidebarItem icon={ICON.INBOX} />
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
