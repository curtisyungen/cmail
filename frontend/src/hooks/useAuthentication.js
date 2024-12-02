import axios from "axios";

import useAppActions from "./useAppActions";

const useAuthentication = () => {
    const { setAuthenticated } = useAppActions();

    const checkAuthentication = async () => {
        try {
            const result = await axios.get("/api/check-authentication");
            if (result.data?.authenticated) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
            }
        } catch (e) {
            console.error("Error checking authentication: ", e);
        }
    };

    return {
        checkAuthentication,
    };
};

export default useAuthentication;
