import { useEffect } from "react";

import { useAppActions, useAppContext } from "../hooks";
import { LS } from "../res";
import { StorageUtils } from "../utils";

const useHistory = () => {
    const { history } = useAppContext();
    const { setHistory } = useAppActions();

    useEffect(() => {
        loadHistory();
    }, []);

    const addToHistory = (newEntry) => {
        const updatedHistory = [...history, newEntry];
        StorageUtils.setItem(LS.HISTORY, updatedHistory);
        setHistory(updatedHistory);
    };

    const clearHistory = () => {
        StorageUtils.removeItem(LS.HISTORY);
        setHistory([]);
    };

    const loadHistory = () => {
        const history = StorageUtils.getItem(LS.HISTORY);
        setHistory(history || []);
    };

    const removeFromHistory = (index) => {
        const updatedHistory = history.filter((_, idx) => index !== idx);
        StorageUtils.setItem(LS.HISTORY, updatedHistory);
        setHistory(updatedHistory);
    };

    return {
        history,
        addToHistory,
        clearHistory,
        loadHistory,
        removeFromHistory,
    };
};

export default useHistory;
