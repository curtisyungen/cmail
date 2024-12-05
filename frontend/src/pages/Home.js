import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import backgroundImage from "../assets/backgroundImage.jpg";
import { ActionBar, Navbar, Sidebar, TitleBar } from "../components";
import { HistoryView, InboxView } from "../components/views";
import { useApi, useAppActions, useAppContext } from "../hooks";
import { DEFAULT_CATEGORIES, LS, PAGES, VIEW } from "../res";
import { Box, COLORS, DIMENS, Flex } from "../styles";
import { StorageUtils } from "../utils";

const Home = () => {
    const navigate = useNavigate();

    const { fetchEmails } = useApi();
    const { activeView, authenticated, emails, status } = useAppContext();
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
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundPositionX: "50%",
                backgroundPositionY: "50%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <TitleBar />
            <Flex alignItems="flex-start">
                <Sidebar />
                <Box
                    background={COLORS.GRAY_LIGHT}
                    justifyContent="flex-start"
                    overflow="hidden"
                >
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
                        {activeView === VIEW.INBOX ? <InboxView /> : <></>}
                        {activeView === VIEW.HISTORY ? <HistoryView /> : <></>}
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default Home;
