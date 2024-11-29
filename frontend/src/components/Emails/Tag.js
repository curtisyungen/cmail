import React from "react";

import { Icon } from "../common";
import { ICON } from "../../res/icons";
import { Box, COLORS, Flex, FONT_SIZE, Text } from "../../styles";

const Tag = ({ color, tag }) => {
    return (
        <Box
            alignItems="flex-start"
            borderColor={color}
            borderRadius={10}
            height={20}
            justifyContent="flex-start"
            padding={{ top: 5 }}
        >
            <Flex>
                <Box
                    bprderColor={color}
                    borderRadius={10}
                    borderWidth={1}
                    margin={{ right: 5 }}
                    padding={3}
                >
                    <Icon color={color} name={ICON.CATEGORY} size={8} />
                </Box>
                <Text center color={COLORS.GRAY_DARK} fontSize={FONT_SIZE.S}>
                    {tag}
                </Text>
            </Flex>
        </Box>
    );
};

export default Tag;
