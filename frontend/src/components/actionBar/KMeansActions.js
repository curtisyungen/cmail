import React, { useEffect } from "react";

import { Icon, Switch } from "../common";
import { useApi, useAppActions, useAppContext } from "../../hooks";
import { LS, STATUS } from "../../res";
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

const KMeansActions = () => {
    const { runKMeans } = useApi();
    const { emails, kmeansConfig, status } = useAppContext();
    const { setKMeansConfig, setTopics, setTopicsMap } = useAppActions();

    useEffect(() => {
        const savedClusters = StorageUtils.getItem(LS.CLUSTERS);
        const savedEmailClusters = StorageUtils.getItem(LS.EMAIL_CLUSTERS);
        setTopics(savedClusters || []);
        setTopicsMap(savedEmailClusters || {});
    }, []);

    const handleConfigChange = (name, value) => {
        setKMeansConfig({
            ...kmeansConfig,
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
                    onClick={runKMeans}
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
                        name={ICON.RUN}
                        size={26}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text center fontSize={FONT_SIZE.S}>
                        {status === STATUS.RUNNING_KMEANS ? "Running" : "Run"}
                    </Text>
                </Box>
                <Box
                    margin={{ right: DIMENS.SPACING_STANDARD }}
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
                        value={kmeansConfig.num_clusters}
                        width={DIMENS.SELECT_WIDTH}
                    >
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
                <Box clickable width={100}>
                    <SettingSwitch
                        disabled={status === STATUS.RUNNING_KMEANS}
                        enabled={kmeansConfig.include_labels}
                        icon={ICON.LABEL}
                        label="Labels"
                        onClick={() =>
                            handleConfigChange(
                                "include_labels",
                                !kmeansConfig.include_labels
                            )
                        }
                    />
                    <SettingSwitch
                        disabled={status === STATUS.RUNNING_KMEANS}
                        enabled={kmeansConfig.include_senders}
                        icon={ICON.SENDER}
                        label="Senders"
                        onClick={() =>
                            handleConfigChange(
                                "include_senders",
                                !kmeansConfig.include_senders
                            )
                        }
                    />
                    <SettingSwitch
                        disabled={status === STATUS.RUNNING_KMEANS}
                        enabled={kmeansConfig.include_subject}
                        icon={ICON.SUBJECT}
                        label="Subject"
                        onClick={() =>
                            handleConfigChange(
                                "include_subject",
                                !kmeansConfig.include_subject
                            )
                        }
                    />
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>K-means</Text>
        </>
    );
};

export default KMeansActions;
