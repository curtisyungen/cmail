import styled from "styled-components";

import { FONT_SIZE } from ".";
import COLORS from "./Colors";

const Text = styled("div")`
    color: ${({ color = COLORS.BLACK, disabled }) =>
        disabled ? COLORS.GRAY_MEDIUM : color};
    font-size: ${({ fontSize = FONT_SIZE.M }) => `${fontSize}px`};
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    text-align: ${({ center, textAlign = "left" }) =>
        center ? "center" : textAlign};
    text-transform: ${({ capitalize, textTransform }) =>
        capitalize ? "capitalize" : textTransform || "unset"};

    &:hover {
        color: ${({ hoverColor }) => hoverColor && hoverColor};
    }
`;

export const TextEllipsis = styled(Text)`
    overflow: hidden !important;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export default Text;
