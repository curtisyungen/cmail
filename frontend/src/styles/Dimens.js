const ACTION_BAR_HEIGHT = 90;
const HOME_PADDING = 30;

const DIMENS = {
    ACTION_BAR_HEIGHT: ACTION_BAR_HEIGHT,
    ACTION_BAR_SECTION_HEIGHT: ACTION_BAR_HEIGHT - 30,
    AVATAR_SIZE: 30,
    BUTTON_HEIGHT: 32,
    BUTTON_WIDTH: 85,
    EMAIL_MAX_HEIGHT: 89,
    EMAIL_MIN_HEIGHT: 63,
    EMAIL_LIST_HEIGHT: `calc(100vh - ${HOME_PADDING}px - ${ACTION_BAR_HEIGHT}px - 15px)`,
    EMAIL_WIDTH: 300,
    HOME_PADDING: HOME_PADDING,
    NAVBAR_HEIGHT: 50,
    SELECT_WIDTH: 80,
    SIDEBAR_WIDTH: 50,
    SPACING_STANDARD: 10,
};

export default DIMENS;
