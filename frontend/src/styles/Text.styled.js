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

export default Text;
