import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { Box, Button } from "../styles";

const CLIENT_ID =
    "1008869086899-bvd2s8dbfue092mho910baieelbr2btf.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3000";
const SCOPES = [
    "https://mail.google.com",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.readonly",
    "openid email profile",
];

const Login = () => {
    return (
        <Box>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
                <LoginButton />
            </GoogleOAuthProvider>
        </Box>
    );
};

const LoginButton = () => {
    const onFailure = (error) => {
        console.error("Login failed: ", error);
    };

    const onSuccess = async (response) => {
        if (response.error) {
            console.error("Error logging in: ", response.error);
            return;
        }

        try {
            const result = await axios.post("/api/authenticate", {
                code: response.code,
                limit: 10,
            });
            const messages = result.data.messages;
            console.log("messages: ", messages);
        } catch (e) {
            console.error("Error authenticating: ", e);
        }
    };

    const login = useGoogleLogin({
        onError: onFailure,
        onSuccess,
        flow: "auth-code",
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(" "),
    });

    return <Button onClick={login}>Login</Button>;
};

export default Login;
