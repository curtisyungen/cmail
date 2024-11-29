import React, { useEffect, useState } from "react";

import { ActionBar, Navbar, Sidebar, TopicsList } from "../components";
import { EmailList, EmailReader, EmptyStateView } from "../components/emails";
import { ALL_TOPICS, DEFAULT_CATEGORIES, LS } from "../res";
import { Box, COLORS, DIMENS, Flex } from "../styles";
import { StorageUtils } from "../utils";

const Home = () => {
    const [activeAction, setActiveAction] = useState(null);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [emailTopics, setEmailTopics] = useState([]);
    const [refreshEmails, setRefreshEmails] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState(ALL_TOPICS);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const savedCategories =
            StorageUtils.getItem(LS.CATEGORIES) || DEFAULT_CATEGORIES;
        setCategories(savedCategories);
    }, []);

    useEffect(() => {
        console.log("categories: ", categories);
    }, [topics]);

    useEffect(() => {
        console.log("topics: ", topics);
    }, [topics]);

    useEffect(() => {
        if (refreshEmails) {
            setRefreshEmails(false);
        }
    }, [refreshEmails]);

    const handleSetTopics = (topics) => {
        setTopics(topics);
        setRefreshEmails(true);
    };

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
                        setActiveAction={setActiveAction}
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
        </Box>
    );
};

export default Home;
