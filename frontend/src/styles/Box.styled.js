import styled from "styled-components";

const Box = styled("div")`
    align-items: ${({ alignItems }) => alignItems};
    background: ${({ background }) => background};
    border-color: ${({ borderColor }) => borderColor};
    border-style: ${({ borderStyle = "solid" }) => borderStyle};
    border-width: ${({ borderWidth = 0 }) => `${borderWidth}px`};
    cursor: ${({ cursor = "default" }) => cursor};
    display: flex;
    flex-direction: column;
    justify-content: ${({ justifyContent = "center" }) => justifyContent};
    margin: ${({ margin }) => `${margin}px`};
    padding: ${({ padding }) => `${padding}px`};
    position: relative;
    width: ${({ width }) => (width ? `${width}px` : "100%")};
`;

export default Box;
