import styled from "styled-components";

import BaseComponent from "./BaseComponent.styled";

const Box = styled(BaseComponent)`
    align-items: ${({ alignItems }) => alignItems};
    background: ${({ background }) => background};
    border-color: ${({ borderColor }) => borderColor};
    border-style: ${({ borderStyle = "solid" }) => borderStyle};
    box-sizing: border-box;
    cursor: ${({ clickable, cursor = "default" }) =>
        clickable ? "pointer" : cursor} !important;
    display: flex;
    flex-direction: column;
    justify-content: ${({ justifyContent = "center" }) => justifyContent};
    position: relative;

    &:hover {
        background: ${({ hoverBackground }) => hoverBackground} !important;
    }
`;

export default Box;
