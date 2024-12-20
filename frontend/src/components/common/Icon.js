import React from "react";

import { FA_COMPONENTS } from "../../res/icons";
import { COLORS } from "../../styles";

const Icon = ({
    background,
    color = COLORS.BLUE_DARK,
    disabled,
    name,
    size = 16,
    style = {},
}) => {
    const FaComponent = FA_COMPONENTS[name];

    if (!FaComponent) {
        return null;
    }

    return (
        <div
            style={{
                background,
                color: disabled ? COLORS.GRAY_MEDIUM : color,
                fontSize: size,
                ...style,
            }}
        >
            <FaComponent
                style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                }}
            />
        </div>
    );
};

export default Icon;
