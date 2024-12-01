import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    ActionBar,
    Navbar,
    Sidebar,
    TitleBar,
    TopicsList,
} from "../components";
import { EmailList, EmailReader, EmptyStateView } from "../components/emails";
import { useApi, useAppActions, useAppContext } from "../hooks";
import { DEFAULT_CATEGORIES, LS, PAGES } from "../res";
import { Box, COLORS, DIMENS, Flex } from "../styles";
import { StorageUtils } from "../utils";

const Home = () => {
    const navigate = useNavigate();

    const { fetchEmails } = useApi();
    const { authenticated, emails, selectedEmail, status } = useAppContext();
    const { setCategories } = useAppActions();

    useEffect(() => {
        if (!authenticated) {
            navigate(PAGES.LOGIN);
        }
    }, [authenticated]);

    useEffect(() => {
        if (authenticated && emails.length === 0 && !status) {
            fetchEmails();
            StorageUtils.removeItem(LS.CLUSTERS);
            StorageUtils.removeItem(LS.EMAIL_CLUSTERS);
        }
    }, [authenticated]);

    useEffect(() => {
        const savedCategories =
            StorageUtils.getItem(LS.CATEGORIES) || DEFAULT_CATEGORIES;
        setCategories(savedCategories);
    }, []);

    if (!authenticated) {
        return null;
    }

    return (
        <Box
            background={COLORS.GRAY_LIGHT}
            height="100vh"
            justifyContent="flex-start"
            overflow="hidden"
        >
            <TitleBar />
            <Flex alignItems="flex-start">
                <Sidebar />
                <Box
                    margin={{
                        right: DIMENS.HOME_PADDING,
                    }}
                    style={{ flex: 1 }}
                    width="unset"
                >
                    <Navbar />
                    <ActionBar />
                    <Box height={DIMENS.SPACING_STANDARD} width="100%" />
                    <Box
                        height={DIMENS.EMAIL_LIST_HEIGHT}
                        justifyContent="flex-start"
                        overflow="hidden"
                    >
                        <Flex
                            alignItems="flex-start"
                            style={{ overflow: "hidden" }}
                        >
                            <TopicsList />
                            <EmailList />
                            <Box
                                height="100%"
                                width={DIMENS.SPACING_STANDARD}
                            />
                            {selectedEmail ? (
                                <EmailReader />
                            ) : (
                                <EmptyStateView />
                            )}
                        </Flex>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default Home;
