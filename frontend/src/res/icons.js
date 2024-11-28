import {} from "@mdi/js";

import {
    FaAtom,
    FaCalendarAlt,
    FaCheck,
    FaCloud,
    FaEnvelopeOpenText,
    FaFileAlt,
    FaRegEnvelope,
    FaRegTrashAlt,
    FaSitemap,
    FaStroopwafel,
    FaTag,
    FaTh,
    FaUserFriends,
} from "react-icons/fa";

export const ICON = {
    CALENDAR: "CALENDAR",
    CATEGORY: "CATEGORY",
    CHECK: "CHECK",
    CLOUD: "CLOUD",
    GENERATE: "GENERATE",
    INBOX: "INBOX",
    NEWS: "NEWS",
    NETWORK: "NETWORK",
    RUN: "RUN",
    STROOP: "STROOP",
    TABLE: "TABLE",
    TRASH: "TRASH",
    USERS: "USERS",
};

export const FA_COMPONENTS = {
    [ICON.CALENDAR]: FaCalendarAlt,
    [ICON.CATEGORY]: FaTag,
    [ICON.CHECK]: FaCheck,
    [ICON.CLOUD]: FaCloud,
    [ICON.GENERATE]: FaRegEnvelope,
    [ICON.INBOX]: FaEnvelopeOpenText,
    [ICON.NETWORK]: FaSitemap,
    [ICON.NEWS]: FaFileAlt,
    [ICON.RUN]: FaAtom,
    [ICON.STROOP]: FaStroopwafel,
    [ICON.TABLE]: FaTh,
    [ICON.TRASH]: FaRegTrashAlt,
    [ICON.USERS]: FaUserFriends,
};

export const MDI_COMPONENTS = {};
