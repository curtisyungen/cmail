import React, { useState } from "react";

import { Icon } from "../../../common";
import { ICON } from "../../../../res/icons";
import { Box, COLORS, Flex, FONT_SIZE, Text } from "../../../../styles";

const TopicsListSection = ({ children, title }) => {
    const [expanded, setExpanded] = useState(true);
    return (
        <>
            <Box
                clickable
                margin={{ bottom: 3, top: 3 }}
                onClick={() => setExpanded(!expanded)}
            >
                <Flex>
                    <Box clickable width={15}>
                        <Icon
                            color={COLORS.GRAY_DARK}
                            name={expanded ? ICON.CHEV_DOWN : ICON.CHEV_RIGHT}
                            size={10}
                        />
                    </Box>
                    <Text bold fontSize={FONT_SIZE.M}>
                        {title}
                    </Text>
                </Flex>
            </Box>
            {expanded ? children : <></>}
        </>
    );
};

export default TopicsListSection;
