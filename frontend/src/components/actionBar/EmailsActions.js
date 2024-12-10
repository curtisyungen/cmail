import React, { useEffect } from "react";

import { Icon } from "../common";
import { useApi, useAppActions, useAppContext } from "../../hooks";
import { STATUS } from "../../res";
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

const EmailsActions = () => {
    const { clearEmailsFromRedis, fetchEmails } = useApi();
    const { emails, numEmails, status } = useAppContext();
    const { setNumEmails } = useAppActions();

    useEffect(() => {
        if (emails?.length > 0 && emails?.length !== numEmails) {
            let roundedCount = emails.length;
            switch (true) {
                case roundedCount >= 100:
                    roundedCount = Math.ceil(roundedCount / 100) * 100;
                    break;
                case roundedCount >= 50:
                    roundedCount = Math.ceil(roundedCount / 50) * 50;
                    break;
                default:
                    roundedCount = Math.ceil(roundedCount / 10) * 10;
            }
            setNumEmails(roundedCount);
        }
    }, [emails]);

    const handleFetchEmails = async () => {
        await clearEmailsFromRedis();
        fetchEmails();
    };

    return (
        <>
            <Flex>
                <Box
                    alignItems="center"
                    borderRadius={DIMENS.BORDER_RADIUS_L}
                    clickable={!status}
                    height={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                    hoverBackground={
                        status ? COLORS.TRANSPARENT : COLORS.GRAY_LIGHT
                    }
                    margin={{ right: DIMENS.SPACING_STANDARD }}
                    onClick={handleFetchEmails}
                    style={{ flex: 1 }}
                    width={DIMENS.ACTION_BAR_SECTION_HEIGHT}
                >
                    <Icon
                        color={status ? COLORS.GRAY_MEDIUM : COLORS.BLUE_DARK}
                        name={ICON.ENVELOPE}
                        size={26}
                        style={{ marginBottom: "5px" }}
                    />
                    <Text
                        center
                        color={status ? COLORS.GRAY_MEDIUM : COLORS.BLACK}
                        fontSize={FONT_SIZE.S}
                    >
                        {status === STATUS.FETCHING_EMAILS
                            ? "Fetching"
                            : "Fetch"}
                    </Text>
                </Box>
                <Box style={{ flex: 1 }}>
                    <Select
                        disabled={false}
                        onChange={(e) => setNumEmails(parseInt(e.target.value))}
                        style={{
                            marginBottom: "5px",
                        }}
                        value={numEmails}
                        width={DIMENS.SELECT_WIDTH}
                    >
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        {Array.from(
                            { length: 20 },
                            (_, index) => (index + 1) * 100
                        ).map((num) => (
                            <option key={num} value={num}>
                                {num}
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

export default EmailsActions;
