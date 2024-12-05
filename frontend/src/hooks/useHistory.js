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
