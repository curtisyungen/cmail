import styled from "styled-components";

import COLORS from "./Colors";

const Text = styled("div")`
    color: ${({ color = COLORS.BLACK }) => color};
    cursor: ${({ clickable }) => clickable && "pointer"};
    font-size: ${({ fontSize = 12 }) => `${fontSize}px`};
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    text-align: ${({ textAlign = "left" }) => textAlign};
    user-select: none;

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
