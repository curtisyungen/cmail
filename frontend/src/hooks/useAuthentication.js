import axios from "axios";

import useAppActions from "./useAppActions";

const useAuthentication = () => {
    const { setAuthenticated } = useAppActions();

    const checkAuthentication = async () => {
        try {
            const result = await axios.get("/api/check-authentication");
            if (result.data?.authenticated) {
                setAuthenticated(true);
                return true;
            } else {
                setAuthenticated(false);
                return false;
            }
        } catch (e) {
            console.error("Error checking authentication: ", e);
        } finally {
            return false;
        }
    };

    return {
        checkAuthentication,
    };
};

export default useAuthentication;
