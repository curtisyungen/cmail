import React from "react";

import { Box, COLORS, DIMENS, Flex, FONT_SIZE, Text } from "../styles";

const Navbar = ({ setSearchTerm }) => {
    return (
        <Box
            height={DIMENS.NAVBAR_HEIGHT}
            padding={{ bottom: 5, left: 20, right: 20, top: 5 }}
            style={{}}
        >
            <Flex>
                <Text bold color={COLORS.BLUE_DARK} fontSize={FONT_SIZE.L}>
                    Kmail
                </Text>
                <input
                    type="search"
                    placeholder="Search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        borderColor: COLORS.BORDER,
                        borderRadius: "5px",
                        borderStyle: "solid",
                        borderWidth: "1px",
                        fontSize: FONT_SIZE.M,
                        height: "25px",
                        marginLeft: "140px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                        width: DIMENS.EMAIL_WIDTH,
                    }}
                />
            </Flex>
        </Box>
    );
};

export default Navbar;
