import React from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from "./common";
import { useApi, useAppActions, useAppContext } from "../hooks";
import { ICON } from "../res/icons";
import { Box, COLORS, DIMENS, Flex } from "../styles";
import { PAGES, VIEW } from "../res";
import { StorageUtils } from "../utils";

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

const SidebarItem = ({ color, icon, onClick = () => {}, selected }) => {
    return (
        <Box alignItems="center" clickable height={38} onClick={onClick}>
            <Flex>
                <SelectionIndicator active={selected} />
                <Icon color={color} name={icon} />
            </Flex>
        </Box>
    );
};

const Sidebar = () => {
    const navigate = useNavigate();

    const { clearRedis } = useApi();
    const { setActiveView } = useAppActions();
    const { activeView } = useAppContext();

    const handleLogout = () => {
        clearRedis();
        StorageUtils.clearAll();
        navigate(PAGES.LOGIN);
    };

    return (
        <Box
            background={COLORS.SIDEBAR}
            height="100%"
            justifyContent="flex-start"
            style={{ minWidth: DIMENS.SIDEBAR_WIDTH }}
            width={DIMENS.SIDEBAR_WIDTH}
        >
            <SidebarItem
                icon={ICON.MAIL}
                onClick={() => setActiveView(VIEW.INBOX)}
                selected={activeView === VIEW.INBOX}
            />
            <SidebarItem
                icon={ICON.HISTORY}
                onClick={() => setActiveView(VIEW.HISTORY)}
                selected={activeView === VIEW.HISTORY}
            />
            <SidebarItem icon={ICON.USERS} />
            <SidebarItem icon={ICON.CHECK} />
            <SidebarItem icon={ICON.NEWS} />
            <SidebarItem icon={ICON.NETWORK} />
            <SidebarItem icon={ICON.CLOUD} />
            <SidebarItem
                color={COLORS.PURPLE}
                icon={ICON.STROOP}
                onClick={handleLogout}
            />
            <SidebarItem color={COLORS.GRAY_DARK} icon={ICON.TABLE} />
        </Box>
    );
};

export default Sidebar;
