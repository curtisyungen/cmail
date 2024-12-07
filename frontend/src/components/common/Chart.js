import React from "react";
import Plot from "react-plotly.js";

import { Box, COLORS, DIMENS } from "../../styles";

const Chart = ({ data, layoutProps }) => {
    return (
        <Box
            borderRadius={DIMENS.BORDER_RADIUS_L}
            borderWidth={1}
            style={{ borderColor: COLORS.BORDER }}
        >
            <Plot
                data={data}
                layout={{
                    margin: { b: 30, l: 30, r: 30, t: 30 },
                    showlegend: false,
                    plot_bgcolor: COLORS.GRAY_LIGHT2,
                    paper_bgcolor: COLORS.GRAY_LIGHT,
                    ...layoutProps,
                }}
            />
        </Box>
    );
};

export default Chart;
