import styled from "styled-components";

import COLORS from "./Colors";

const Select = styled("select")`
    background: ${({ background }) => background};
    border-color: ${({ borderColor }) => borderColor};
    border-radius: 5px;
    color: ${({ color = COLORS.BLACK }) => color};
    font-size: ${({ fontSize = 12 }) => `${fontSize}px`};
    padding: 5px;
    width: ${({ width }) => `${width}px`};

    &:active,
    :focus {
        outline: none;
    }
`;

export default Select;
