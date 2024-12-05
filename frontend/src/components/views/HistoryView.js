import React, { useEffect, useState } from "react";

import { Icon } from "../common";
import { useAppContext, useHistory } from "../../hooks";
import { ICON } from "../../res/icons";
import { Box, COLORS, DIMENS, Flex, Text } from "../../styles";

const Entry = ({
    featureConfig,
    modelConfig,
    namingConfig,
    numClusters,
    silhouetteScore,
}) => {
    return (
        <Box width="100%">
            <Flex justifyContent="space-between">
                <Label label={modelConfig.model} />
                <Label label={modelConfig.num_clusters} />
                <Label label={featureConfig.model} />
                <Label boolean label={featureConfig.include_bodies} />
                <Label boolean label={featureConfig.include_dates} />
                <Label boolean label={featureConfig.include_subject} />
                <Label boolean label={featureConfig.include_labels} />
                <Label boolean label={featureConfig.include_senders} />
                <Label boolean label={featureConfig.include_thread_ids} />
                <Label label={namingConfig.model} />
                <Label label={numClusters} />
                <Label label={Math.round(silhouetteScore * 100) / 100} />
            </Flex>
        </Box>
    );
};

const Label = ({ bold, boolean, label }) => {
    return (
        <Box alignItems="center">
            {boolean ? (
                label ? (
                    <Icon color={COLORS.BLACK} name={ICON.CHECK} size={14} />
                ) : (
                    <></>
                )
            ) : (
                <Text bold={bold}>{boolean ? !!label : label || "-"}</Text>
            )}
        </Box>
    );
};

const Header = () => {
    return (
        <Box width="100%">
            <Flex justifyContent="space-between">
                <Label bold label={"Clustering Model"} />
                <Label bold label={"Num. Clusters"} />
                <Label bold label={"Feature Model"} />
                <Label bold label={"Bodies"} />
                <Label bold label={"Dates"} />
                <Label bold label={"Subject"} />
                <Label bold label={"Labels"} />
                <Label bold label={"Senders"} />
                <Label bold label={"Thread IDs"} />
                <Label bold label={"Naming Model"} />
                <Label bold label={"Num. Clusters Result"} />
                <Label bold label={"Score"} />
            </Flex>
        </Box>
    );
};

const HistoryView = () => {
    const { selectedEmail } = useAppContext();

    const { clearHistory, history } = useHistory();

    useEffect(() => {
        console.log("history: ", history);
    }, [history]);

    return (
        <Box
            background={COLORS.WHITE}
            borderRadius={5}
            height={DIMENS.EMAIL_LIST_HEIGHT}
            justifyContent="flex-start"
            overflow="hidden"
            padding={10}
            style={{ boxShadow: `0px 1px 2px ${COLORS.GRAY_MEDIUM}` }}
        >
            <Header />
            <Flex alignItems="flex-start" style={{ overflow: "hidden" }}>
                {history.map((entry, idx) => (
                    <Entry key={idx} {...entry} />
                ))}
            </Flex>
        </Box>
    );
};

export default HistoryView;
