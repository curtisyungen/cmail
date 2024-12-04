import React, { useEffect } from "react";

import { Icon } from "../common";
import { useApi, useAppActions, useAppContext } from "../../hooks";
import { MODEL, LS, STATUS } from "../../res";
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
import { StorageUtils } from "../../utils";

const MAX_CLUSTERS = 30;

const ModelActions = () => {
    const { runModel } = useApi();
    const { emails, modelConfig, status } = useAppContext();
    const { setModelConfig, setTopics, setTopicsMap } = useAppActions();

    useEffect(() => {
        const savedClusters = StorageUtils.getItem(LS.CLUSTERS);
        const savedEmailClusters = StorageUtils.getItem(LS.EMAIL_CLUSTERS);
        setTopics(savedClusters || []);
        setTopicsMap(savedEmailClusters || {});
    }, []);

    const handleConfigChange = (name, value) => {
        setModelConfig({
            ...modelConfig,
            [name]: value,
        });
    };

    const kmeansDisabled = status || emails.length === 0;

    return (
        <>
            <Flex>
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={!kmeansDisabled}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        kmeansDisabled ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    onClick={runModel}
                    style={{
                        flex: 1,
                        minWidth: DIMENS.ACTION_BAR_SECTION_HEIGHT,
                    }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={
                            kmeansDisabled
                                ? COLORS.GRAY_MEDIUM
                                : COLORS.BLUE_DARK
                        }
                        name={
                            modelConfig.model === MODEL.CLUSTERING.KMEANS
                                ? ICON.KMEANS
                                : ICON.HDBSCAN
                        }
                        size={26}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text center fontSize={FONT_SIZE.S}>
                        {status === STATUS.RUNNING_KMEANS ? "Running" : "Run"}
                    </Text>
                </Box>
                <Box
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    style={{ flex: 1 }}
                >
                    <Select
                        disabled={status === STATUS.RUNNING_KMEANS}
                        name="model"
                        onChange={(e) =>
                            handleConfigChange("model", e.target.value)
                        }
                        style={{
                            marginBottom: "5px",
                        }}
                        value={modelConfig.model}
                        width="100px"
                    >
                        {Object.entries(MODEL.CLUSTERING).map(
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
                {modelConfig.model === MODEL.CLUSTERING.KMEANS ? (
                    <Box
                        height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                        margin={{ left: 5 }}
                        style={{ flex: 1 }}
                    >
                        <Select
                            disabled={status === STATUS.RUNNING_KMEANS}
                            onChange={(e) =>
                                handleConfigChange(
                                    "num_clusters",
                                    parseInt(e.target.value)
                                )
                            }
                            style={{
                                marginBottom: "5px",
                            }}
                            value={modelConfig.num_clusters}
                            width={DIMENS.SELECT_WIDTH}
                        >
                            <option value={null}>Optimal</option>
                            {Array.from(
                                { length: MAX_CLUSTERS },
                                (_, index) => index + 1
                            ).map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </Select>
                        <Text center fontSize={FONT_SIZE.S}>
                            No. Clusters
                        </Text>
                    </Box>
                ) : (
                    <></>
                )}
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Model</Text>
        </>
    );
};

export default ModelActions;
