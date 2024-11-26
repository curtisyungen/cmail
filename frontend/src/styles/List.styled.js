import styled from "styled-components";

import BaseComponent from "./BaseComponent.styled";
import COLORS from "./Colors";

const List = styled(BaseComponent)`
    overflow-x: ${({ canScrollX }) => (canScrollX ? "scroll" : "hidden")};
    overflow-y: ${({ canScrollY }) => (canScrollY ? "scroll" : "hidden")};

    ::-webkit-scrollbar {
        background: ${COLORS.SECONDARY};
        display: block;
        height: 8px;
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background: ${COLORS.PRIMARY};
        opacity: 0.8;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${COLORS.TERTIARY};
        opacity: 1;
    }
`;

export default List;
