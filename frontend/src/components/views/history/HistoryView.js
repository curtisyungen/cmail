import React, { useEffect, useState } from "react";

import SideColumn from "./SideColumn";
import { Entry, Header, Title } from "./HistoryViewComponents";
import { BoxWithShadow } from "../../common";
import { useHistory } from "../../../hooks";
import { MODEL } from "../../../res";
import { Box, DIMENS, Flex } from "../../../styles";
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
            const {
                featureConfig,
                modelConfig,
                numClusters,
                numEmails,
                silhouetteScore,
            } = entry;
            historyValues.push({
                index: idx,
                clusteringModel: modelConfig.model,
                featureModel: featureConfig.model,
                includeBodies: featureConfig.include_bodies,
                includeCapitals: featureConfig.include_capitals,
                includeDates: featureConfig.include_dates,
                includeLabels: featureConfig.include_labels,
                includeSenders: featureConfig.include_senders,
                includeSubject: featureConfig.include_subjects,
                includeThreadIds: featureConfig.include_thread_ids,
                numClustersInput:
                    modelConfig.model === MODEL.CLUSTERING.KMEANS
                        ? modelConfig.num_clusters
                        : null,
                numClustersOutput: numClusters,
                numEmails,
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
        <Box padding={{ left: DIMENS.SPACING_STANDARD }}>
            <Flex alignItems="flex-start" style={{ overflow: "hidden" }}>
                <SideColumn />
                <BoxWithShadow
                    height={DIMENS.EMAIL_LIST_HEIGHT}
                    justifyContent="flex-start"
                    overflow="hidden"
                    style={{
                        borderBottomLeftRadius: "0px",
                        borderBottomRightRadius: "0px",
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "5px",
                    }}
                >
                    <Title onSortClick={handleSortClick} sortType={sortType} />
                    <Header />
                    <Box
                        justifyContent="flex-start"
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
                </BoxWithShadow>
            </Flex>
        </Box>
    );
};

export default HistoryView;
