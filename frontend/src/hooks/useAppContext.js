import { useContext } from "react";

import { AppContext } from "../AppContext";

const useAppContext = () => {
    const { state } = useContext(AppContext);
    return state;
};

export default useAppContext;
