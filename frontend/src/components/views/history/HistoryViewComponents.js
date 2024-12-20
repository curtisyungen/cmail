import React from "react";

import { Icon } from "../../common";
import { ICON } from "../../../res/icons";
import {
    Box,
    COLORS,
    DIMENS,
    Flex,
    FONT_SIZE,
    Text,
    TextEllipsis,
} from "../../../styles";
import { Utils } from "../../../utils";

const LABEL_HEIGHT = 36;
const LABEL_WIDTH_S = 70;
const LABEL_WIDTH_L = 95;

export const Entry = ({
    clusteringModel,
    featureModel,
    includeBodies,
    includeCapitals,
    includeDates,
    includeLabels,
    includeRecipients,
    includeSenders,
    includeSubject,
    includeThreadIds,
    maxEmailLength,
    numClustersInput,
    numClustersOutput,
    numEmails,
    onDelete,
    score,
}) => {
    return (
        <Box style={borderBottomStyle} width="100%">
            <Flex justifyContent="space-between">
                <Box>
                    <Flex justifyContent="space-evenly">
                        <Label label={clusteringModel} />
                        <Label label={numClustersInput} />{" "}
                        <Label label={numEmails} />
                    </Flex>
                </Box>
                <Box>
                    <Flex justifyContent="space-evenly">
                        <Box style={borderLeftStyle}>
                            <Label label={featureModel} />
                        </Box>
                        <Label label={maxEmailLength} width={LABEL_WIDTH_S} />
                        <Label
                            boolean
                            label={includeDates}
                            width={LABEL_WIDTH_S}
                        />
                        <Label
                            boolean
                            label={includeSubject}
                            width={LABEL_WIDTH_S}
                        />
                        <Label
                            boolean
                            label={includeBodies}
                            width={LABEL_WIDTH_S}
                        />
                        <Label
                            boolean
                            label={includeRecipients}
                            width={LABEL_WIDTH_S}
                        />
                        <Label
                            boolean
                            label={includeSenders}
                            width={LABEL_WIDTH_S}
                        />
                        <Label
                            boolean
                            label={includeLabels}
                            width={LABEL_WIDTH_S}
                        />
                        <Label
                            boolean
                            label={includeThreadIds}
                            width={LABEL_WIDTH_S}
                        />
                        <Box style={borderRightStyle}>
                            <Label
                                boolean
                                label={includeCapitals}
                                width={LABEL_WIDTH_S}
                            />
                        </Box>
                    </Flex>
                </Box>
                <Box>
                    <Flex justifyContent="space-evenly">
                        <Label label={numClustersOutput} />
                        <Label
                            bold
                            color={Utils.getScoreColor(score)}
                            label={score}
                        />
                        <Box
                            center
                            clickable
                            onClick={onDelete}
                            style={{ minWidth: "30px" }}
                            width={30}
                        >
                            <Icon
                                color={COLORS.GRAY_DARK}
                                name={ICON.TRASH}
                                size={14}
                            />
                        </Box>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export const Header = () => {
    return (
        <Box style={borderBottomStyle} width="100%">
            <Flex alignItems="flex-start" justifyContent="space-between">
                <Box style={borderRightStyle}>
                    <Box style={borderBottomStyle}>
                        <HeaderLabel label="Clustering" width="100%" />
                    </Box>
                    <Flex justifyContent="space-evenly">
                        <HeaderLabel label="Model" />
                        <HeaderLabel label="Num. Clusters" />{" "}
                        <HeaderLabel label="Num. Emails" />
                    </Flex>
                </Box>
                <Box style={borderRightStyle}>
                    <Box style={borderBottomStyle}>
                        <HeaderLabel label="Features" width="100%" />
                    </Box>
                    <Flex justifyContent="space-evenly">
                        <HeaderLabel label="Model" />
                        <HeaderLabel
                            label="Max. Length"
                            width={LABEL_WIDTH_S}
                        />
                        <HeaderLabel label="Dates" width={LABEL_WIDTH_S} />
                        <HeaderLabel label="Subject" width={LABEL_WIDTH_S} />
                        <HeaderLabel label="Bodies" width={LABEL_WIDTH_S} />
                        <HeaderLabel label="Recipients" width={LABEL_WIDTH_S} />
                        <HeaderLabel label="Senders" width={LABEL_WIDTH_S} />
                        <HeaderLabel label="Labels" width={LABEL_WIDTH_S} />
                        <HeaderLabel label="Thread IDs" width={LABEL_WIDTH_S} />
                        <HeaderLabel label="Capitals" width={LABEL_WIDTH_S} />
                    </Flex>
                </Box>
                <Box>
                    <Box style={borderBottomStyle}>
                        <HeaderLabel label="Results" width="100%" />
                    </Box>
                    <Flex justifyContent="space-evenly">
                        <HeaderLabel label="Num. Clusters" />
                        <HeaderLabel label="Score" />
                        <Box width={30} />
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

const HeaderLabel = ({ label, style, width = LABEL_WIDTH_L }) => {
    return (
        <Box alignItems="center" padding="5px" style={style} width={width}>
            <TextEllipsis
                center
                color={COLORS.GRAY_DARK}
                fontSize={FONT_SIZE.S}
            >
                {label}
            </TextEllipsis>
        </Box>
    );
};

const Label = ({ bold, boolean, color, label, width = LABEL_WIDTH_L }) => {
    return (
        <Box
            alignItems="center"
            height={LABEL_HEIGHT}
            style={{ minWidth: width }}
            width={width}
        >
            {boolean ? (
                label ? (
                    <Icon color={COLORS.BLACK} name={ICON.CHECK} size={10} />
                ) : (
                    <Text center>-</Text>
                )
            ) : (
                <TextEllipsis
                    bold={bold}
                    center
                    color={color}
                    fontSize={FONT_SIZE.M}
                >
                    {boolean ? !!label : label || "-"}
                </TextEllipsis>
            )}
        </Box>
    );
};

export const Title = ({ onSortClick, sortType }) => {
    return (
        <Box padding="10px 20px" style={borderBottomStyle}>
            <Flex justifyContent="space-between">
                <Text bold fontSize={FONT_SIZE.L}>
                    History
                </Text>
                <Box
                    borderRadius={DIMENS.BORDER_RADIUS_L}
                    clickable
                    hoverBackground={COLORS.GRAY_LIGHT}
                    onClick={onSortClick}
                    padding={5}
                    style={{ minWidth: "80px" }}
                    width="fit-content"
                >
                    <Flex justifyContent="center">
                        <Icon
                            color={COLORS.BLACK}
                            name={ICON.SORT}
                            style={{ marginRight: "10px" }}
                        />
                        <Text>{sortType}</Text>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

const borderBottomStyle = {
    borderBottomWidth: "1px",
    borderColor: COLORS.BORDER,
};

const borderLeftStyle = {
    borderColor: COLORS.BORDER,
    borderLeftWidth: "1px",
};

const borderRightStyle = {
    borderColor: COLORS.BORDER,
    borderRightWidth: "1px",
};
