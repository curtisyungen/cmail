import React from "react";

import { EmailList, EmailReader, EmptyStateView } from "./emails";
import { TopicsList } from "./topics";
import { useAppContext } from "../../../hooks";
import { Box, DIMENS, Flex } from "../../../styles";

const InboxView = () => {
    const { selectedEmail } = useAppContext();
    return (
        <Box
            height={DIMENS.EMAIL_LIST_HEIGHT}
            justifyContent="flex-start"
            padding={{ left: DIMENS.SPACING_STANDARD + 2 }}
            overflow="hidden"
        >
            <Flex alignItems="flex-start" style={{ overflow: "hidden" }}>
                <TopicsList />
                <EmailList />
                <Box height="100%" width={DIMENS.SPACING_STANDARD} />
                {selectedEmail ? <EmailReader /> : <EmptyStateView />}
            </Flex>
        </Box>
    );
};

export default InboxView;
