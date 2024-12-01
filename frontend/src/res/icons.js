import {} from "@mdi/js";

import {
    FaAtom,
    FaBars,
    FaCalendarAlt,
    FaCheck,
    FaCloud,
    FaEnvelopeOpenText,
    FaFileAlt,
    FaFolder,
    FaInbox,
    FaRegEnvelope,
    FaRegFolder,
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
    ENVELOPE: "ENVELOPE",
    FOLDER: "FOLDER",
    FOLDER_REG: "FOLDER_REG",
    INBOX: "INBOX",
    MAIL: "MAIL",
    MENU: "MENU",
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
    [ICON.ENVELOPE]: FaRegEnvelope,
    [ICON.FOLDER]: FaFolder,
    [ICON.FOLDER_REG]: FaRegFolder,
    [ICON.INBOX]: FaInbox,
    [ICON.MAIL]: FaEnvelopeOpenText,
    [ICON.MENU]: FaBars,
    [ICON.NETWORK]: FaSitemap,
    [ICON.NEWS]: FaFileAlt,
    [ICON.RUN]: FaAtom,
    [ICON.STROOP]: FaStroopwafel,
    [ICON.TABLE]: FaTh,
    [ICON.TRASH]: FaRegTrashAlt,
    [ICON.USERS]: FaUserFriends,
};

export const MDI_COMPONENTS = {};
