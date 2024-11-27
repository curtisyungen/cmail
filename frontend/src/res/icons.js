import {} from "@mdi/js";

import {
    FaCalendarAlt,
    FaCheck,
    FaCloud,
    FaEnvelopeOpenText,
    FaFileAlt,
    FaSitemap,
    FaStroopwafel,
    FaTh,
    FaUserFriends,
} from "react-icons/fa";

export const ICON = {
    CALENDAR: "CALENDAR",
    CHECK: "CHECK",
    CLOUD: "CLOUD",
    ENVELOPE: "ENVELOPE",
    NEWS: "NEWS",
    NETWORK: "NETWORK",
    STROOP: "STROOP",
    TABLE: "TABLE",
    USERS: "USERS",
};

export const FA_COMPONENTS = {
    [ICON.CALENDAR]: FaCalendarAlt,
    [ICON.CHECK]: FaCheck,
    [ICON.CLOUD]: FaCloud,
    [ICON.ENVELOPE]: FaEnvelopeOpenText,
    [ICON.NETWORK]: FaSitemap,
    [ICON.NEWS]: FaFileAlt,
    [ICON.STROOP]: FaStroopwafel,
    [ICON.TABLE]: FaTh,
    [ICON.USERS]: FaUserFriends,
};

export const MDI_COMPONENTS = {};
