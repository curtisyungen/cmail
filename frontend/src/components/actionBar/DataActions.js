import React, { useEffect, useState } from "react";
import axios from "axios";

import { Icon } from "../common";
import { ACTION } from "../../res";
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

const DEFAULT_EMAIL_COUNT = 100;

const DataActions = ({ activeAction, setActiveAction }) => {
    const [emailCount, setEmailCount] = useState(DEFAULT_EMAIL_COUNT);

    const emailCountOptions = Array.from(
        { length: 10 },
        (_, i) => (i + 1) * 100
    );

    const handleGenerate = async () => {
        if (activeAction) {
            return;
        }
        setActiveAction(ACTION.GENERATE);
        try {
            const res = await axios.post("/api/generate-data", {
                emailCount,
            });
            console.log("response: ", res.data);
        } catch (e) {
            console.log("Error generating data: ", e);
        } finally {
            setActiveAction(null);
        }
    };

    return (
        <>
            <Flex>
                <Box
                    alignItems="center"
                    borderRadius={5}
                    clickable={!activeAction}
                    height={DIMENS.HEADER_SECTION_HEIGHT}
                    hoverBackground={
                        activeAction ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    onClick={handleGenerate}
                    style={{ flex: 1 }}
                    width={DIMENS.HEADER_SECTION_HEIGHT}
                >
                    <Icon
                        color={
                            activeAction ? COLORS.GRAY_MEDIUM : COLORS.BLUE_DARK
                        }
                        name={ICON.GENERATE}
                        size={24}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text center fontSize={FONT_SIZE.S}>
                        {activeAction === ACTION.GENERATE
                            ? "Generating"
                            : "Generate"}
                    </Text>
                </Box>
                <Box style={{ flex: 1 }}>
                    <Select
                        disabled={activeAction}
                        onChange={(e) =>
                            setEmailCount(parseInt(e.target.value))
                        }
                        style={{
                            marginBottom: "5px",
                        }}
                        value={emailCount}
                        width={DIMENS.SELECT_WIDTH}
                    >
                        {emailCountOptions.map((count) => (
                            <option key={count} value={count}>
                                {count}
                            </option>
                        ))}
                    </Select>
                    <Text center fontSize={FONT_SIZE.S}>
                        No. Emails
                    </Text>
                </Box>
            </Flex>
            <Text fontSize={FONT_SIZE.XS}>Data</Text>
        </>
    );
};

export default DataActions;
