import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AppContext } from "../AppContext";
import { ActionBar, Loading, Navbar, Sidebar, TopicsList } from "../components";
import { EmailList, EmailReader, EmptyStateView } from "../components/emails";
import { useAppActions } from "../hooks";
import { DEFAULT_CATEGORIES, LS, PAGES } from "../res";
import { Box, COLORS, DIMENS, Flex } from "../styles";
import { StorageUtils } from "../utils";

const Home = () => {
    const navigate = useNavigate();
    const { state } = useContext(AppContext);
    const {
        authenticated,
        categories,
        emails,
        loading,
        selectedEmail,
        selectedTopic,
        topics,
        topicsMap,
    } = state;

    const {
        setCategories,
        setEmails,
        setLoading,
        setSelectedEmail,
        setSelectedTopic,
        setTopics,
        setTopicsMap,
    } = useAppActions();

    const [activeAction, setActiveAction] = useState(null);
    const [emailTopics, setEmailTopics] = useState([]);
    const [refreshEmails, setRefreshEmails] = useState(false);

    useEffect(() => {
        if (!authenticated) {
            navigate(PAGES.LOGIN);
        }
    }, [authenticated]);

    useEffect(() => {
        if (authenticated && emails.length === 0) {
            fetchEmails();
        }
    }, [authenticated]);

    useEffect(() => {
        const savedCategories =
            StorageUtils.getItem(LS.CATEGORIES) || DEFAULT_CATEGORIES;
        setCategories(savedCategories);
    }, []);

    useEffect(() => {
        if (refreshEmails) {
            setRefreshEmails(false);
        }
    }, [refreshEmails]);

    async function fetchEmails() {
        setLoading(true);
        try {
            const response = await axios.get("/api/fetch-emails", {
                params: { limit: 400 },
            });
            console.log("response: ", response);
            if (response.status === 200) {
                setEmails(response.data.emails);
            } else {
                console.log(response.data.message || "Failed to fetch emails.");
            }
        } catch (err) {
            console.log("Error fetching emails: ", err);
        } finally {
            setLoading(false);
        }
    }
    const handleSetTopics = (topics) => {
        setTopics(topics);
        setRefreshEmails(true);
    };

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
            <Navbar />
            <Flex alignItems="flex-start">
                <Sidebar />
                <Box
                    margin={{
                        right: DIMENS.HOME_PADDING,
                    }}
                    style={{ flex: 1 }}
                    width="unset"
                >
                    <ActionBar
                        activeAction={activeAction}
                        categories={categories}
                        setCategories={setCategories}
                        setEmailTopics={setEmailTopics}
                        setTopics={handleSetTopics}
                    />
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
                            <TopicsList
                                selectedTopic={selectedTopic}
                                setSelectedTopic={setSelectedTopic}
                                topics={topics}
                                topicsMap={emailTopics}
                            />
                            <EmailList
                                categories={categories}
                                refreshEmails={refreshEmails}
                                selectedEmail={selectedEmail}
                                selectedTopic={selectedTopic}
                                setSelectedEmail={setSelectedEmail}
                                topics={topics}
                                topicsMap={emailTopics}
                            />
                            <Box
                                height="100%"
                                width={DIMENS.SPACING_STANDARD}
                            />
                            {selectedEmail ? (
                                <EmailReader selectedEmail={selectedEmail} />
                            ) : (
                                <EmptyStateView />
                            )}
                        </Flex>
                    </Box>
                </Box>
            </Flex>
            {loading ? <Loading /> : <></>}
        </Box>
    );
};

export default Home;
