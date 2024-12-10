import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AppContextProvider } from "./AppContext";
import { Loading } from "./components";
import { Home, Login } from "./pages";
import { PAGES } from "./res";

import "./App.css";

const App = () => {
    return (
        <AppContextProvider>
            <Loading />
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
