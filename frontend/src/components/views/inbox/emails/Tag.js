import React from "react";

import { Icon } from "../../../common";
import { ICON } from "../../../../res/icons";
import { Box, COLORS, Flex, FONT_SIZE, TextEllipsis } from "../../../../styles";

const Tag = ({ color, tag }) => {
    return (
        <Box
            alignItems="flex-start"
            borderRadius={10}
            clickable
            height={20}
            justifyContent="flex-start"
            padding={{ top: 5 }}
        >
            <Flex>
                <Box
                    borderColor={color}
                    borderRadius={10}
                    borderWidth={1}
                    clickable
                    margin={{ right: 5 }}
                    padding={4}
                    width="fit-content"
                >
                    <Icon color={color} name={ICON.CATEGORY} size={8} />
                </Box>
                <TextEllipsis
                    center
                    color={COLORS.GRAY_DARK}
                    fontSize={FONT_SIZE.S}
                >
                    {tag}
                </TextEllipsis>
            </Flex>
        </Box>
    );
};

export default Tag;
