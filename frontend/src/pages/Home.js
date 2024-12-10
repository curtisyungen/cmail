import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import backgroundImage from "../assets/backgroundImage.jpg";
import { ActionBar, Loading, Navbar, Sidebar, TitleBar } from "../components";
import { HistoryView, InboxView } from "../components/views";
import { useApi, useAppActions, useAppContext } from "../hooks";
import { DEFAULT_CATEGORIES, DEFAULT_STOPWORDS, LS, PAGES, VIEW } from "../res";
import { Box, COLORS, DIMENS, Flex } from "../styles";
import { StorageUtils } from "../utils";

const Home = () => {
    const navigate = useNavigate();

    const { fetchEmails, getEmailAddress } = useApi();
    const { activeView, authenticated, emails, status } = useAppContext();
    const {
        setCategories,
        setModelResult,
        setStopwords,
        setTopics,
        setTopicsMap,
    } = useAppActions();

    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        if (!authenticated) {
            navigate(PAGES.LOGIN);
        }
    }, [authenticated]);

    useEffect(() => {
        if (authenticated && emails?.length === 0 && !status) {
            fetchEmails();
            getEmailAddress();
        }
    }, [authenticated]);

    useEffect(() => {
        loadStoredData();
    }, []);

    const loadStoredData = () => {
        const savedCategories = StorageUtils.getItem(LS.CATEGORIES);
        const savedClusters = StorageUtils.getItem(LS.CLUSTERS);
        const savedEmailClusters = StorageUtils.getItem(LS.EMAIL_CLUSTERS);
        const savedModelResult = StorageUtils.getItem(LS.MODEL_RESULT);
        const savedStopwords = StorageUtils.getItem(LS.STOPWORDS);
        setCategories(savedCategories || DEFAULT_CATEGORIES);
        setModelResult(savedModelResult || {});
        setStopwords(savedStopwords || DEFAULT_STOPWORDS);
        setTopics(savedClusters || []);
        setTopicsMap(savedEmailClusters || {});
    };

    if (!authenticated) {
        return null;
    }

    return (
        <Box
            background={COLORS.GRAY_LIGHT}
            height="100vh"
            justifyContent="flex-start"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundPositionX: "50%",
                backgroundPositionY: "50%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                overflowY: "hidden",
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
            {showLoading ? (
                <Loading onComplete={() => setShowLoading(false)} />
            ) : (
                <></>
            )}
        </Box>
    );
};

export default Home;
