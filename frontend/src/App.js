import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AppContextProvider } from "./AppContext";
import { Home, Login } from "./pages";

const App = () => {
    return (
        <AppContextProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </AppContextProvider>
    );
};

export default App;
