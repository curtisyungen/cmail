import styled from "styled-components";

import COLORS from "./Colors";
import DIMENS from "./Dimens";

const Button = styled("button")`
    align-items: center;
    background-color: ${({ background }) => background};
    border: none;
    border-color: ${({ borderColor }) => borderColor};
    border-radius: 5px;
    border-style: ${({ borderWidth }) => borderWidth && "solid"};
    border-width: ${({ borderWidth = 0 }) => `${borderWidth}px`};
    color: ${({ color = COLORS.BLACK }) => color};
    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    display: flex;
    font-size: ${({ fontSize = 12 }) => `${fontSize}px`};
    height: ${({ height = DIMENS.BUTTON_HEIGHT }) => `${height}px`};
    justify-content: center;
    min-height: ${({ height = DIMENS.BUTTON_HEIGHT }) => `${height}px`};
    outline: none;
    ${({ margin }) => `${margin}px`};
    padding: 0px 10px;
    transition: ${({ transition = "0.5s" }) => transition};
    user-select: none;
    white-space: nowrap;
    width: ${({ width = DIMENS.BUTTON_WIDTH }) => `${width}px`};

    ${({ style }) => style && style};

    &:active {
        outline: none;
    }

    &:focus {
        outline: none;
    }

    &:hover {
        background-color: ${({ hoverColor }) => hoverColor};
    }
`;

export default Button;
