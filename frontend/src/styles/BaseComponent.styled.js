import styled from "styled-components";

import { StyledUtils } from "../utils";

const BaseComponent = styled("div")`
    border-radius: ${({ borderRadius }) =>
        StyledUtils.getSizeValue({ value: borderRadius })};
    border-width: ${({ borderWidth }) =>
        StyledUtils.getBorderWidth({ borderWidth })};
    box-shadow: ${({ boxShadow }) => StyledUtils.getBoxShadow({ boxShadow })};
    height: ${({ height }) =>
        StyledUtils.getSizeValue({
            defaultValue: "fit-content",
            value: height,
        })};
    ${({ margin }) => StyledUtils.getMargin({ margin })};
    max-width: ${({ width }) =>
        StyledUtils.getSizeValue({
            defaultValue: "100%",
            value: width,
        })};
    min-height: ${({ height }) =>
        StyledUtils.getSizeValue({
            defaultValue: "fit-content",
            value: height,
        })};
    overflow: ${({ overflow }) => overflow || "hidden"};
    ${({ padding }) => StyledUtils.getPadding({ padding })};
    transition: ${({ transition = "0.5s" }) => transition};
    width: ${({ width }) =>
        StyledUtils.getSizeValue({
            defaultValue: "100%",
            value: width,
        })};
`;

export default BaseComponent;
