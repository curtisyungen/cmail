import { useEffect, useState } from "react";

import { LS } from "../res";
import { StorageUtils } from "../utils";

const useHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const clearHistory = () => {
        StorageUtils.removeItem(LS.HISTORY);
        setHistory([]);
    };

    const loadHistory = () => {
        const history = StorageUtils.getItem(LS.HISTORY);
        setHistory(history || []);
    };

    const updateHistory = (newEntry) => {
        const updatedHistory = [...history, newEntry];
        StorageUtils.setItem(LS.HISTORY, updatedHistory);
        setHistory(updatedHistory);
    };

    return {
        history,
        clearHistory,
        loadHistory,
        updateHistory,
    };
};

export default useHistory;
