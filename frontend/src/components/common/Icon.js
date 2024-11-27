import React from "react";

import { FA_COMPONENTS } from "../../res/icons";
import { COLORS } from "../../styles";

const Icon = ({
    background,
    color = COLORS.BLUE_DARK,
    name,
    size = 18,
    style = {},
}) => {
    const FaComponent = FA_COMPONENTS[name];

    if (!FaComponent) {
        return null;
    }

    return (
        <div style={{ background, color, fontSize: size, ...style }}>
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
