import React from "react";

import { Icon, Switch } from "../common";
import { useAppActions, useAppContext } from "../../hooks";
import { MODEL, STATUS } from "../../res";
import { ICON } from "../../res/icons";
import { Box, DIMENS, Flex, FONT_SIZE, Select, Text } from "../../styles";

const SettingSwitch = ({ disabled, enabled, icon, label, onClick }) => {
    return (
        <Flex justifyContent="space-between" style={{ marginTop: "2px" }}>
            <Flex>
                <Icon
                    disabled={disabled}
                    name={icon}
                    size={12}
                    style={{ marginRight: "5px" }}
                />
                <Text disabled={disabled} fontSize={FONT_SIZE.S}>
                    {label}
                </Text>
            </Flex>
            <Switch disabled={disabled} enabled={enabled} onClick={onClick} />
        </Flex>
    );
};

const NeuralActions = () => {
    const { featureConfig, status } = useAppContext();
    const { setFeatureConfig } = useAppActions();

    const handleConfigChange = (name, value) => {
        setFeatureConfig({
            ...featureConfig,
            [name]: value,
        });
    };

    return (
        <>
            <Flex>
                <Box
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    margin={{ right: DIMENS.SPACING_STANDARD }}
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
                        value={featureConfig.model}
                        width="100px"
                    >
                        <option value={null}>None</option>
                        {Object.entries(MODEL.FEATURE_EXTRACTION).map(
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
                <Box
                    clickable
                    height="100%"
                    justifyContent="flex-start"
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    width={100}
                >
                    <SettingSwitch
                        disabled={status === STATUS.RUNNING_KMEANS}
                        enabled={featureConfig.include_dates}
                        icon={ICON.DATE}
                        label="Dates"
                        onClick={() =>
                            handleConfigChange(
                                "include_dates",
                                !featureConfig.include_dates
                            )
                        }
                    />
                    <SettingSwitch
                        disabled={status === STATUS.RUNNING_KMEANS}
                        enabled={featureConfig.include_subject}
                        icon={ICON.SUBJECT}
                        label="Subject"
                        onClick={() =>
                            handleConfigChange(
                                "include_subject",
                                !featureConfig.include_subject
                            )
                        }
                    />
                    <SettingSwitch
                        disabled={status === STATUS.RUNNING_KMEANS}
                        enabled={featureConfig.include_labels}
                        icon={ICON.LABEL}
                        label="Labels"
                        onClick={() =>
                            handleConfigChange(
                                "include_labels",
                                !featureConfig.include_labels
                            )
                        }
                    />
                </Box>
                <Box
                    clickable
                    justifyContent="flex-start"
                    height="100%"
                    width={100}
                >
                    <SettingSwitch
                        disabled={status === STATUS.RUNNING_KMEANS}
                        enabled={featureConfig.include_senders}
                        icon={ICON.SENDER}
                        label="Senders"
                        onClick={() =>
                            handleConfigChange(
                                "include_senders",
                                !featureConfig.include_senders
                            )
                        }
                    />
                    <SettingSwitch
                        disabled={status === STATUS.RUNNING_KMEANS}
                        enabled={featureConfig.include_thread_ids}
                        icon={ICON.THREAD_ID}
                        label="Thread IDs"
                        onClick={() =>
                            handleConfigChange(
                                "include_thread_ids",
                                !featureConfig.include_thread_ids
                            )
                        }
                    />
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Feature Modeling</Text>
        </>
    );
};

export default NeuralActions;
