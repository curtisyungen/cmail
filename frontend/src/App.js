import React, { useEffect, useState } from "react";
import axios from "axios";

import { ClusterVisualization, RunModel } from "./components";

const App = () => {
    return (
        <div>
            <h1>Model Runner</h1>
            <RunModel />
        </div>
    );
};

export default App;
