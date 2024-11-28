import React from "react";

import { Icon } from "../common";
import { ACTION } from "../../res";
import { ICON } from "../../res/icons";
import {
    Box,
    COLORS,
    DIMENS,
    Flex,
    FONT_SIZE,
    Select,
    Text,
} from "../../styles";

const MAX_NO_ABOVE = 10; // will be * 10
const MAX_NO_BELOW = 6;

const LdaActions = ({ activeAction, ldaConfig, setLdaConfig }) => {
    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setLdaConfig({
            ...ldaConfig,
            [name]: value,
        });
    };

    return (
        <>
            <Flex>
                <Box
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    margin={{ right: 5 }}
                    style={{ flex: 1 }}
                >
                    <Select
                        disabled={activeAction}
                        name="noBelow"
                        onChange={handleConfigChange}
                        style={{
                            marginBottom: "5px",
                        }}
                        value={ldaConfig.noBelow}
                        width={DIMENS.SELECT_WIDTH}
                    >
                        {Array.from(
                            { length: MAX_NO_BELOW },
                            (_, index) => index
                        ).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </Select>
                    <Text center fontSize={FONT_SIZE.S}>
                        Min. Freq.
                    </Text>
                </Box>
                <Box
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    style={{ flex: 1 }}
                >
                    <Select
                        disabled={activeAction}
                        name="noAbove"
                        onChange={handleConfigChange}
                        style={{
                            marginBottom: "5px",
                        }}
                        value={ldaConfig.noAbove}
                        width={DIMENS.SELECT_WIDTH}
                    >
                        {Array.from(
                            { length: MAX_NO_ABOVE },
                            (_, index) => (index + 1) * 10
                        ).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </Select>
                    <Text center fontSize={FONT_SIZE.S}>
                        Max. Freq. (%)
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Latent Dirichlet Allocation</Text>
        </>
    );
};

export default LdaActions;
