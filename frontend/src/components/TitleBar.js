import React from "react";

import { APP_NAME } from "../res";
import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../styles";
import { useAppActions, useAppContext } from "../hooks";

const TitleBar = () => {
    const { searchTerm } = useAppContext();
    const { setSearchTerm } = useAppActions();
    return (
        <Box
            background={COLORS.SIDEBAR}
            height={DIMENS.TITLEBAR_HEIGHT}
            padding={{ bottom: 5, left: 20, right: 20, top: 5 }}
            style={{}}
        >
            <Flex>
                <Text
                    bold
                    color={COLORS.BLUE_DARK}
                    fontSize={FONT_SIZE.L}
                    style={{ userSelect: "none" }}
                >
                    {APP_NAME}
                </Text>
                <input
                    value={searchTerm}
                    type="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    style={{
                        borderColor: COLORS.BORDER,
                        borderRadius: "5px",
                        borderStyle: "solid",
                        borderWidth: "1px",
                        fontSize: FONT_SIZE.M,
                        height: "25px",
                        marginLeft: "195px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                        width: DIMENS.EMAIL_WIDTH,
                    }}
                />
            </Flex>
        </Box>
    );
};

export default TitleBar;
