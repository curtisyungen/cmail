import { COLORS } from "../styles";

class Utils {
    static getScoreColor(score) {
        switch (true) {
            case score <= 0.25:
                return COLORS.RED;
            case score <= 0.5:
                return COLORS.ORANGE;
            case score <= 0.75:
                return COLORS.YELLOW;
            case score <= 1:
                return COLORS.GREEN;
            default:
                return COLORS.GRAY_MEDIUM;
        }
    }

    static parseJSON(string) {
        try {
            const parsed = JSON.parse(string);
            return parsed;
        } catch (e) {
            return string;
        }
    }
}

export default Utils;
