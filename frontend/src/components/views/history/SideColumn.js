import React, { useEffect, useState } from "react";

import { Icon } from "../../common";
import { useAppContext } from "../../../hooks";
import { ICON } from "../../../res/icons";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../../../styles";

const SideColumn = () => {
    const { emailAddress } = useAppContext();

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

    return (
        <Box
            margin={{ right: DIMENS.SPACING_STANDARD }}
            padding={{ left: 10 }}
            style={{ minWidth: "200px" }}
            width={200}
        >
            <Box margin={{ bottom: 5, top: 5 }}>
                <Flex>
                    <Icon
                        color={COLORS.GRAY_DARK2}
                        name={ICON.CHEV_DOWN}
                        size={FONT_SIZE.M}
                        style={{ marginRight: "5px" }}
                    />
                    <Text bold color={COLORS.GRAY_DARK2} fontSize={FONT_SIZE.M}>
                        {formattedEmailAddress}
                    </Text>
                </Flex>
            </Box>
            <Box
                background={COLORS.BLUE_LIGHT}
                borderRadius={3}
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
        </Box>
    );
};

export default SideColumn;
