import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AppContextProvider } from "./AppContext";
import { Home, Login } from "./pages";
import { PAGES } from "./res";

const App = () => {
    return (
        <AppContextProvider>
            <Router>
                <Routes>
                    <Route path={PAGES.LOGIN} element={<Login />} />
                    <Route path={PAGES.HOME} element={<Home />} />
                </Routes>
            </Router>
        </AppContextProvider>
    );
};

export default App;
