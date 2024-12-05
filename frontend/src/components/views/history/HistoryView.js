import React, { useEffect, useState } from "react";

import SideColumn from "./SideColumn";
import { Entry, Header, Title } from "./HistoryViewComponents";
import { useHistory } from "../../../hooks";
import { MODEL } from "../../../res";
import { Box, COLORS, DIMENS, Flex } from "../../../styles";
import { SortUtils } from "../../../utils";

const SORT = {
    CLUSTERS: "Clusters",
    DATE: "Date",
    MODEL: "Model",
    SCORE: "Score",
};

const SORT_ORDER = [SORT.CLUSTERS, SORT.DATE, SORT.MODEL, SORT.SCORE];

const HistoryView = () => {
    const { history } = useHistory();

    const [sortedHistory, setSortedHistory] = useState([]);
    const [sortType, setSortType] = useState(SORT.DATE);

    useEffect(() => {
        const historyValues = [];
        history.forEach((entry, idx) => {
            const { featureConfig, modelConfig, numClusters, silhouetteScore } =
                entry;
            historyValues.push({
                index: idx,
                clusteringModel: modelConfig.model,
                featureModel: featureConfig.model,
                includeBodies: featureConfig.include_bodies,
                includeDates: featureConfig.include_dates,
                includeLabels: featureConfig.include_labels,
                includeSenders: featureConfig.include_senders,
                includeSubject: featureConfig.include_subject,
                includeThreadIds: featureConfig.include_thread_ids,
                numClustersInput:
                    modelConfig.model === MODEL.CLUSTERING.KMEANS
                        ? modelConfig.num_clusters
                        : null,
                numClustersOutput: numClusters,
                score: Math.round(silhouetteScore * 100) / 100,
            });
        });
        sortHistory(historyValues, sortType);
    }, [history]);

    const handleSortClick = () => {
        let currSortIdx = SORT_ORDER.indexOf(sortType);
        let nextSortIdx = currSortIdx + 1;
        if (nextSortIdx === SORT_ORDER.length) {
            nextSortIdx = 0;
        }
        const nextSortType = SORT_ORDER[nextSortIdx];
        setSortType(nextSortType);
        sortHistory(sortedHistory, nextSortType);
    };

    const sortHistory = (history, sortType) => {
        let sortKey;
        switch (sortType) {
            case SORT.CLUSTERS:
                sortKey = "numClusters";
                break;
            case SORT.DATE:
                sortKey = "index";
                break;
            case SORT.MODEL:
                sortKey = "clusteringModel";
                break;
            case SORT.SCORE:
                sortKey = "score";
                break;
            default:
                sortKey = "index";
        }
        setSortedHistory(
            SortUtils.sortData({
                data: history,
                key: sortKey,
                reverse: sortType === SORT.SCORE,
            })
        );
    };

    return (
        <Flex alignItems="flex-start" style={{ overflow: "hidden" }}>
            <SideColumn />
            <Box
                justifyContent="flex-start"
                style={{
                    flex: 1,
                    height: "100%",
                    padding: 2,
                    paddingBottom: 0,
                }}
                width="auto"
            >
                <Box
                    background={COLORS.WHITE}
                    height={DIMENS.EMAIL_LIST_HEIGHT}
                    justifyContent="flex-start"
                    overflow="hidden"
                    style={{
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "5px",
                        boxShadow: `0px 1px 2px ${COLORS.GRAY_MEDIUM}`,
                    }}
                >
                    <Title onSortClick={handleSortClick} sortType={sortType} />
                    <Header />
                    <Box
                        style={{
                            overflowX: "scroll",
                            overflowY: "scroll",
                            scrollbarWidth: "none",
                        }}
                    >
                        {sortedHistory.map((entry, idx) => (
                            <Entry key={idx} {...entry} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
};

export default HistoryView;
