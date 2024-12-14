import React, { useEffect, useState } from "react";

import { Icon } from "../../common";
import { useAppContext, useHistory } from "../../../hooks";
import { ICON } from "../../../res/icons";
import {
    Box,
    COLORS,
    DIMENS,
    Flex,
    FONT_SIZE,
    Text,
    TextEllipsis,
} from "../../../styles";

const SideColumn = () => {
    const { emailAddress, showNavigationPane } = useAppContext();
    const { clearHistory, history } = useHistory();

    const [formattedEmailAddress, setFormattedEmailAddress] = useState("");

    useEffect(() => {
        if (!emailAddress) {
            return;
        }
        const emailParts = emailAddress.split("@");
        const capitalizedName =
            emailParts[0].charAt(0).toUpperCase() +
            emailParts[0].slice(1) +
            "@";
        setFormattedEmailAddress(capitalizedName.concat(emailParts[1]));
    }, [emailAddress]);

    const handleClearHistory = () => {
        if (window.confirm("Clear history?")) {
            clearHistory();
        }
    };

    if (!showNavigationPane) {
        return null;
    }

    return (
        <Box
            padding={{
                right: DIMENS.SPACING_STANDARD,
            }}
            style={{
                maxWidth: `${DIMENS.TOPICS_LIST_WIDTH}px`,
                minWidth: "fit-content",
            }}
            width={DIMENS.TOPICS_LIST_WIDTH}
        >
            <Box margin={{ bottom: 5, top: 5 }}>
                <Flex>
                    <Icon
                        color={COLORS.GRAY_DARK2}
                        name={ICON.CHEV_DOWN}
                        size={FONT_SIZE.M}
                        style={{ marginRight: "5px" }}
                    />
                    <TextEllipsis
                        bold
                        color={COLORS.GRAY_DARK2}
                        fontSize={FONT_SIZE.M}
                    >
                        {formattedEmailAddress}
                    </TextEllipsis>
                </Flex>
            </Box>
            <Box
                background={COLORS.BLUE_LIGHT}
                borderRadius={DIMENS.BORDER_RADIUS_S}
                padding={{ bottom: 5, left: 19, top: 5 }}
            >
                <Flex>
                    <Icon
                        color={COLORS.GRAY_DARK2}
                        name={ICON.HISTORY}
                        size={FONT_SIZE.M}
                        style={{ marginRight: "10px" }}
                    />
                    <Text>History</Text>
                </Flex>
            </Box>
            <Box
                clickable={history.length > 0}
                hoverBackground={
                    history.length > 0 ? COLORS.GRAY_LIGHT3 : COLORS.GRAY_LIGHT
                }
                onClick={handleClearHistory}
                padding={{ bottom: 6, left: 19, top: 6 }}
            >
                <Flex>
                    <Icon
                        color={COLORS.GRAY_DARK2}
                        disabled={history.length === 0}
                        name={ICON.TRASH}
                        size={FONT_SIZE.M}
                        style={{ marginRight: "10px" }}
                    />
                    <Text disabled={history.length === 0}>Clear history</Text>
                </Flex>
            </Box>
        </Box>
    );
};

export default SideColumn;
