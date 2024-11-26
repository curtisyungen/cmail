import COLORS from "../styles/Colors";

class StyledUtils {
    static getBorderWidth({ borderWidth }) {
        if (!borderWidth) {
            return "0px";
        }

        if (typeof borderWidth === "object") {
            const { all, bottom, left, right, top } = borderWidth;
            if (all) {
                return `${all}px`;
            }

            let borderString = "";
            if (bottom) borderString += `border-bottom-width: ${bottom}px;`;
            if (left) borderString += `border-left-width: ${left}px;`;
            if (right) borderString += `border-right-width: ${right}px;`;
            if (top) borderString += `border-top-width: ${top}px;`;
            return borderString;
        }

        const finalBorderWidth = this.getSizeValue({
            defaultValue: "0px",
            value: borderWidth,
        });

        return finalBorderWidth && `border-width: ${finalBorderWidth};`;
    }

    static getBoxShadow({ boxShadow }) {
        if (!boxShadow) return "none";
        const {
            bottom = 0,
            color = COLORS.GRAY_LIGHT,
            left = 0,
            right = 0,
            top = 0,
        } = boxShadow;

        const feather = 1;
        const radius = 5;

        return (
            `${left}px ${top}px ${radius}px ${feather}px ${color},` +
            `${right}px ${bottom}px ${radius}px ${feather}px ${color}`
        );
    }

    static getMargin({ margin }) {
        if (!margin) {
            return null;
        }

        if (typeof margin === "object") {
            const { bottom, left, right, top } = margin;
            let marginString = "";
            if (bottom) marginString += `margin-bottom: ${bottom}px;`;
            if (left) marginString += `margin-left: ${left}px;`;
            if (right) marginString += `margin-right: ${right}px;`;
            if (top) marginString += `margin-top: ${top}px;`;
            return marginString;
        }

        const finalMargin = this.getSizeValue({
            defaultValue: "0px",
            value: margin,
        });

        return finalMargin && `margin: ${finalMargin}`;
    }

    static getPadding({ padding }) {
        if (!padding) {
            return null;
        }

        if (typeof padding === "object") {
            const { bottom, left, right, top } = padding;
            let paddingString = "";
            if (bottom) paddingString += `padding-bottom: ${bottom}px;`;
            if (left) paddingString += `padding-left: ${left}px;`;
            if (right) paddingString += `padding-right: ${right}px;`;
            if (top) paddingString += `padding-top: ${top}px;`;
            return paddingString;
        }

        const finalPadding = this.getSizeValue({
            defaultValue: "0px",
            value: padding,
        });
        return finalPadding && `padding: ${finalPadding}`;
    }

    static getSizeValue({ defaultValue, value }) {
        return typeof value === "number" ? `${value}px` : value || defaultValue;
    }
}

export default StyledUtils;
