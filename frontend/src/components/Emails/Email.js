import React, { useEffect, useState } from "react";

import Tag from "./Tag";
import { useAppContext } from "../../hooks";
import { ALL_TOPICS, UNKNOWN_SENDER } from "../../res";
import {
    Box,
    COLORS,
    DIMENS,
    Flex,
    FONT_SIZE,
    Text,
    TextEllipsis,
} from "../../styles";
import { DateTimeUtils } from "../../utils";

const CLIPPED_BODY_LENGTH = 50;

const Email = ({ email, isSelected, onClick, topicId }) => {
    const { categories, selectedTopic, topics, topicsMap } = useAppContext();

    const [category, setCategory] = useState(null);

    useEffect(() => {
        loadCategory();
    }, [email, topicsMap]);

    const loadCategory = () => {
        try {
            let category = null;
            for (const { label, topic_id } of topics.flat()) {
                if (topic_id === topicId) {
                    const matchingCategory = categories.find(
                        ({ name }) => name.toLowerCase() === label.toLowerCase()
                    );
                    if (matchingCategory) {
                        category = matchingCategory;
                    } else {
                        category = { color: COLORS.BLUE_DARK, name: label };
                    }
                    break;
                }
            }
            setCategory(category);
        } catch (e) {
            console.log("Error getting category: ", e);
        }
    };

    const getClippedBody = () => {
        const body = typeof email.body === Array ? email.body[0] : email.body;
        return body.slice(0, CLIPPED_BODY_LENGTH);
    };

    if (selectedTopic !== ALL_TOPICS && selectedTopic !== topicId) {
        return null;
    }

    return (
        <Box
            background={isSelected ? COLORS.BLUE_LIGHT : COLORS.WHITE}
            borderColor={COLORS.BORDER}
            clickable={true}
            height="fit-content"
            hoverBackground={isSelected ? COLORS.BLUE_LIGHT : COLORS.GRAY_LIGHT}
            onClick={onClick}
            padding={10}
            style={{
                borderBottomWidth: 1,
                maxHeight: DIMENS.EMAIL_MAX_HEIGHT,
                userSelect: "none",
            }}
            transition={"0s"}
            width="100%"
        >
            <TextEllipsis>
                {email.from.split("<")[0]?.trim() || UNKNOWN_SENDER}
            </TextEllipsis>
            <Box style={{ height: "2px" }} />
            <Flex justifyContent="space-between">
                <TextEllipsis
                    fontSize={FONT_SIZE.S}
                    style={{ marginRight: "13px" }}
                >
                    {email.raw_subject || "No subject"}
                </TextEllipsis>
                <Text fontSize={FONT_SIZE.S}>
                    {DateTimeUtils.millisToSimpleDate(email.date)}
                </Text>
            </Flex>
            <Box style={{ height: "2px" }} />
            <TextEllipsis fontSize={FONT_SIZE.S}>
                {getClippedBody()}
                {email.body.length > CLIPPED_BODY_LENGTH ? "..." : ""}
            </TextEllipsis>
            {category?.name ? (
                <Tag color={category?.color} tag={category?.name} />
            ) : (
                <></>
            )}
        </Box>
    );
};

export default Email;
