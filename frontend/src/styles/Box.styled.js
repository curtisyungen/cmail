import styled from "styled-components";

import BaseComponent from "./BaseComponent.styled";

const Box = styled(BaseComponent)`
    align-items: ${({ alignItems }) => alignItems};
    background: ${({ background }) => background};
    border-color: ${({ borderColor }) => borderColor};
    border-style: ${({ borderStyle = "solid" }) => borderStyle};
    cursor: ${({ cursor = "default" }) => cursor};
    display: flex;
    flex-direction: column;
    justify-content: ${({ justifyContent = "center" }) => justifyContent};
    position: relative;
`;

export default Box;
