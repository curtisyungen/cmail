import styled from "styled-components";

const Flex = styled("div")`
    align-items: ${({ alignItems = "center" }) => alignItems};
    display: flex;
    flex-direction: ${({ column }) => (column ? "column" : "row")};
    flex-wrap: ${({ flexWrap }) => (flexWrap ? "wrap" : "unset")};
    justify-content: ${({ justifyContent = "flex-start" }) => justifyContent};
`;

export default Flex;
