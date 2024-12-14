import React, { useEffect, useState } from "react";

import { Icon } from "../common";
import { useApi, useAppActions, useAppContext } from "../../hooks";
import { MODEL, STATUS } from "../../res";
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

const MAX_CLUSTERS = 30;

const ModelActions = () => {
    const { runModel } = useApi();
    const { emails, featureConfig, modelConfig, status } = useAppContext();
    const { setModelConfig } = useAppActions();

    const [featureConfigEmpty, setFeatureConfigEmpty] = useState(false);

    const kmeansSelected =
        modelConfig.model === MODEL.CLUSTERING.KMEANS ||
        modelConfig.model === MODEL.CLUSTERING.LAYERED_KMEANS;
    const runModelDisabled =
        status || emails?.length === 0 || featureConfigEmpty;

    useEffect(() => {
        setFeatureConfigEmpty(getIsFeatureConfigEmpty());
    }, [featureConfig]);

    const getIsFeatureConfigEmpty = () => {
        return !(
            featureConfig.include_bodies ||
            featureConfig.include_capitals ||
            featureConfig.include_dates ||
            featureConfig.include_labels ||
            featureConfig.include_recipients ||
            featureConfig.include_senders ||
            featureConfig.include_subjects ||
            featureConfig.include_thread_ids
        );
    };

    const handleConfigChange = (name, value) => {
        setModelConfig({
            ...modelConfig,
            [name]: value,
        });
    };

    const handleRunModel = () => {
        if (runModelDisabled) {
            return;
        }
        runModel();
    };

    return (
        <>
            <Flex>
                <Box
                    alignItems="center"
                    borderRadius={DIMENS.BORDER_RADIUS_L}
                    clickable={!runModelDisabled}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        runModelDisabled
                            ? COLORS.TRANSPARENT
                            : COLORS.GRAY_LIGHT
                    }
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    onClick={handleRunModel}
                    style={{
                        flex: 1,
                        minWidth: DIMENS.ACTION_BAR_SECTION_HEIGHT,
                    }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={
                            runModelDisabled
                                ? COLORS.GRAY_MEDIUM
                                : COLORS.BLUE_DARK
                        }
                        name={kmeansSelected ? ICON.KMEANS : ICON.HDBSCAN}
                        size={26}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text center fontSize={FONT_SIZE.S}>
                        {status === STATUS.RUNNING_MODEL ? "Running" : "Run"}
                    </Text>
                </Box>
                <Box
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    style={{ flex: 1 }}
                >
                    <Select
                        disabled={status === STATUS.RUNNING_MODEL}
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
                {kmeansSelected ? (
                    <Box
                        height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                        margin={{ left: 5 }}
                        style={{ flex: 1 }}
                    >
                        <Select
                            disabled={status === STATUS.RUNNING_MODEL}
                            onChange={(e) =>
                                handleConfigChange(
                                    "num_clusters",
                                    parseInt(e.target.value)
                                )
                            }
                            style={{
                                marginBottom: "5px",
                            }}
                            value={modelConfig.num_clusters || ""}
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
                {modelConfig.model === MODEL.CLUSTERING.HDBSCAN ? (
                    <>
                        <Box
                            height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                            margin={{ left: 5 }}
                            style={{ flex: 1 }}
                        >
                            <Select
                                disabled={status === STATUS.RUNNING_MODEL}
                                onChange={(e) =>
                                    handleConfigChange(
                                        "min_cluster_size",
                                        parseInt(e.target.value)
                                    )
                                }
                                style={{
                                    marginBottom: "5px",
                                }}
                                value={modelConfig.min_cluster_size || ""}
                                width={DIMENS.SELECT_WIDTH}
                            >
                                {Array.from(
                                    { length: 49 },
                                    (_, index) => index
                                ).map((num) => (
                                    <option key={num} value={num + 2}>
                                        {num + 2}
                                    </option>
                                ))}
                            </Select>
                            <Text center fontSize={FONT_SIZE.S}>
                                Min. Cluster Size
                            </Text>
                        </Box>
                        <Box
                            height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                            margin={{ left: 5 }}
                            style={{ flex: 1 }}
                        >
                            <Select
                                disabled={status === STATUS.RUNNING_MODEL}
                                onChange={(e) =>
                                    handleConfigChange(
                                        "min_samples",
                                        parseInt(e.target.value)
                                    )
                                }
                                style={{
                                    marginBottom: "5px",
                                }}
                                value={modelConfig.min_samples || ""}
                                width={DIMENS.SELECT_WIDTH}
                            >
                                {Array.from(
                                    { length: 10 },
                                    (_, index) => index + 1
                                ).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </Select>
                            <Text center fontSize={FONT_SIZE.S}>
                                Min. Samples
                            </Text>
                        </Box>
                    </>
                ) : (
                    <></>
                )}
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Clustering</Text>
        </>
    );
};

export default ModelActions;
