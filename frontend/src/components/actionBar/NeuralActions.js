import React from "react";

import { useAppActions, useAppContext } from "../../hooks";
import { Box, DIMENS, Flex, FONT_SIZE, Select, Text } from "../../styles";
import { MODEL, STATUS } from "../../res";

const NeuralActions = () => {
    const { neuralConfig, status } = useAppContext();
    const { setNeuralConfig } = useAppActions();

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setNeuralConfig({
            ...neuralConfig,
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
                        disabled={status === STATUS.RUNNING_KMEANS}
                        name="model"
                        onChange={handleConfigChange}
                        style={{
                            marginBottom: "5px",
                        }}
                        value={neuralConfig.model}
                        width="100px"
                    >
                        <option value={null}>None</option>
                        {Object.entries(MODEL).map(([key, value]) => (
                            <option key={key} value={value}>
                                {value}
                            </option>
                        ))}
                    </Select>
                    <Text center fontSize={FONT_SIZE.S}>
                        Model
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Feature Modeling</Text>
        </>
    );
};

export default NeuralActions;
