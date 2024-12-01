import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    ActionBar,
    Navbar,
    Sidebar,
    TitleBar,
    TopicsList,
} from "../components";
import { EmailList, EmailReader, EmptyStateView } from "../components/emails";
import { useAppActions, useAppContext } from "../hooks";
import { DEFAULT_CATEGORIES, LS, PAGES } from "../res";
import { Box, COLORS, DIMENS, Flex } from "../styles";
import { StorageUtils } from "../utils";

const Home = () => {
    const navigate = useNavigate();
    const { authenticated, emails, loading, selectedEmail } = useAppContext();
    const { setCategories, setEmails, setLoading } = useAppActions();

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

    async function fetchEmails() {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get("/api/fetch-emails", {
                params: { limit: 400 },
            });
            console.log("fetch_emails response: ", response);
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
            {/* {loading ? <Loading /> : <></>} */}
        </Box>
    );
};

export default Home;
