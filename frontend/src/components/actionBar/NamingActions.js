import React from "react";

import { useAppActions, useAppContext } from "../../hooks";
import { MODEL, STATUS } from "../../res";
import { Box, DIMENS, Flex, FONT_SIZE, Select, Text } from "../../styles";

const MAX_NO_ABOVE = 100;
const MAX_NO_BELOW = 5;

const NamingActions = () => {
    const { namingConfig, status } = useAppContext();
    const { setNamingConfig } = useAppActions();

    const handleConfigChange = (e) => {
        let { name, value } = e.target;
        if (name === "no_above") {
            value /= 10;
        }
        setNamingConfig({
            ...namingConfig,
            [name]: value,
        });
    };

    return (
        <>
            <Flex>
                <Box
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    style={{ flex: 1 }}
                >
                    <Select
                        disabled={status === STATUS.RUNNING_KMEANS}
                        name="model"
                        onChange={handleConfigChange}
                        style={{
                            marginBottom: "5px",
                        }}
                        value={namingConfig.model}
                        width={DIMENS.SELECT_WIDTH}
                    >
                        <option value={null}>None</option>
                        {Object.entries(MODEL.TOPIC_NAMING).map(
                            ([key, value]) => (
                                <option key={key} value={value}>
                                    {value}
                                </option>
                            )
                        )}
                    </Select>
                    <Text center fontSize={FONT_SIZE.S}>
                        Model
                    </Text>
                </Box>
                {namingConfig.model === MODEL.TOPIC_NAMING.LDA ? (
                    <>
                        <Box
                            height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                            margin={{ left: 5 }}
                            style={{ flex: 1 }}
                        >
                            <Select
                                disabled={status === STATUS.RUNNING_KMEANS}
                                name="no_below"
                                onChange={handleConfigChange}
                                style={{
                                    marginBottom: "5px",
                                }}
                                value={namingConfig.no_below}
                                width={DIMENS.SELECT_WIDTH}
                            >
                                {Array.from(
                                    { length: MAX_NO_BELOW },
                                    (_, index) => index + 1
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
                            margin={{ left: 5 }}
                            style={{ flex: 1 }}
                        >
                            <Select
                                disabled={status === STATUS.RUNNING_KMEANS}
                                name="no_above"
                                onChange={handleConfigChange}
                                style={{
                                    marginBottom: "5px",
                                }}
                                value={namingConfig.no_above * 10}
                                width={DIMENS.SELECT_WIDTH}
                            >
                                {Array.from(
                                    { length: MAX_NO_ABOVE / 10 },
                                    (_, index) => index + 1
                                ).map((num) => (
                                    <option key={num} value={num}>
                                        {num * 10}
                                    </option>
                                ))}
                            </Select>
                            <Text center fontSize={FONT_SIZE.S}>
                                Max. Freq. (%)
                            </Text>
                        </Box>
                    </>
                ) : (
                    <></>
                )}
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Cluster Naming</Text>
        </>
    );
};

export default NamingActions;