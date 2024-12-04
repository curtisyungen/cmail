import React from "react";

import { Icon, Switch } from "../common";
import { useAppActions, useAppContext } from "../../hooks";
import { MODEL, STATUS } from "../../res";
import { ICON } from "../../res/icons";
import { Box, DIMENS, Flex, FONT_SIZE, Select, Text } from "../../styles";

const SettingSwitch = ({ disabled, enabled, icon, label, onClick }) => {
    return (
        <Flex
            justifyContent="space-between"
            style={{ marginTop: "2px", opacity: disabled ? 0.5 : 1 }}
        >
            <Flex>
                <Icon
                    disabled={disabled}
                    name={icon}
                    size={12}
                    style={{ marginRight: "5px" }}
                />
                <Text fontSize={FONT_SIZE.S}>{label}</Text>
            </Flex>
            <Switch disabled={disabled} enabled={enabled} onClick={onClick} />
        </Flex>
    );
};

const FeatureActions = () => {
    const { featureConfig, status } = useAppContext();
    const { setFeatureConfig } = useAppActions();

    const handleConfigChange = (name, value) => {
        const updatedConfig = {
            ...featureConfig,
            [name]: value,
        };
        if (name === "model" && value === MODEL.FEATURE_EXTRACTION.BERT) {
            updatedConfig.include_bodies = true;
        }
        setFeatureConfig(updatedConfig);
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
                        enabled={
                            featureConfig.include_bodies ||
                            featureConfig.model ===
                                MODEL.FEATURE_EXTRACTION.BERT
                        }
                        icon={ICON.BODY}
                        label="Bodies"
                        onClick={() =>
                            handleConfigChange(
                                "include_bodies",
                                !featureConfig.include_bodies ||
                                    featureConfig.model ===
                                        MODEL.FEATURE_EXTRACTION.BERT
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

export default FeatureActions;
