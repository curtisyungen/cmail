import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from "./common";
import { useApi, useAppActions, useAppContext } from "../hooks";
import { ICON } from "../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, OPACITY, Text } from "../styles";
import { PAGES, VIEW } from "../res";
import { StorageUtils } from "../utils";

const SelectionIndicator = ({ active }) => {
    return (
        <Box
            background={active ? COLORS.BLUE_DARK : COLORS.TRANSPARENT}
            borderRadius={DIMENS.BORDER_RADIUS_L}
            height={24}
            style={{ left: 0, position: "absolute" }}
            width={3}
        />
    );
};

const SidebarItem = ({
    clickable,
    color,
    icon,
    onClick = () => {},
    selected,
    tooltip,
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
        <Box
            alignItems="center"
            clickable={clickable}
            height={38}
            hoverBackground={clickable ? COLORS.GRAY_LIGHT : COLORS.SIDEBAR}
            onClick={onClick}
            onMouseEnter={() => setShowTooltip(!!tooltip)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{
                opacity: clickable ? OPACITY.NORMAL : OPACITY.LIGHT,
                overflow: "visible",
            }}
        >
            <Flex>
                <SelectionIndicator active={selected} />
                <Icon color={color} name={icon} />
            </Flex>

            {showTooltip ? (
                <Box
                    background={COLORS.WHITE}
                    borderRadius={DIMENS.BORDER_RADIUS_L}
                    padding="5px"
                    style={{
                        boxShadow: `0px 1px 2px ${COLORS.GRAY_MEDIUM}`,
                        left: DIMENS.SIDEBAR_WIDTH - 10,
                        position: "absolute",
                        zIndex: 999,
                    }}
                >
                    <Text center fontSize={FONT_SIZE.S}>
                        {tooltip}
                    </Text>
                </Box>
            ) : (
                <></>
            )}
        </Box>
    );
};

const Sidebar = () => {
    const navigate = useNavigate();

    const { clearRedis } = useApi();
    const { setActiveView } = useAppActions();
    const { activeView } = useAppContext();

    const handleLogout = () => {
        if (window.confirm("Logout?")) {
            clearRedis();
            StorageUtils.clearAll();
            navigate(PAGES.LOGIN);
        }
    };

    return (
        <Box
            background={COLORS.SIDEBAR}
            height="100%"
            justifyContent="flex-start"
            style={{ minWidth: DIMENS.SIDEBAR_WIDTH, overflow: "visible" }}
            width={DIMENS.SIDEBAR_WIDTH}
        >
            <SidebarItem
                clickable={true}
                icon={ICON.MAIL}
                onClick={() => setActiveView(VIEW.INBOX)}
                selected={activeView === VIEW.INBOX}
                tooltip="Mail"
            />
            <SidebarItem
                clickable={true}
                icon={ICON.HISTORY}
                onClick={() => setActiveView(VIEW.HISTORY)}
                selected={activeView === VIEW.HISTORY}
                tooltip="History"
            />
            <SidebarItem icon={ICON.USERS} />
            <SidebarItem icon={ICON.CHECK} />
            <SidebarItem icon={ICON.NEWS} />
            <SidebarItem icon={ICON.NETWORK} />
            <SidebarItem icon={ICON.CLOUD} />
            <SidebarItem
                clickable={true}
                color={COLORS.PURPLE}
                icon={ICON.LOGOUT}
                onClick={handleLogout}
                tooltip="Logout"
            />
            <SidebarItem color={COLORS.GRAY_DARK} icon={ICON.TABLE} />
        </Box>
    );
};

export default Sidebar;
