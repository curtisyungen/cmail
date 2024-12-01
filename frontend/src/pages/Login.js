import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { Box, Button, COLORS, FONT_SIZE, Text } from "../styles";
import {
    useApi,
    useAppActions,
    useAppContext,
    useAuthentication,
} from "../hooks";
import { PAGES } from "../res";

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
    const navigate = useNavigate();

    const { authenticateUser } = useApi();
    const { authenticated } = useAppContext();
    const { setAuthenticated } = useAppActions();
    const { checkAuthentication } = useAuthentication();

    const [authenticating, setAuthenticating] = useState(false);

    useEffect(() => {
        checkAuthentication();
    }, []);

    useEffect(() => {
        if (authenticated) {
            navigate(PAGES.HOME);
        }
    }, [authenticated]);

    const onFailure = (error) => {
        console.error("Login failed: ", error);
    };

    const onSuccess = (response) => {
        if (response.error) {
            console.error("Error logging in: ", response.error);
            return;
        }
        authenticateUser(response.code, () => {
            setAuthenticated(true);
            navigate(PAGES.HOME);
        });
    };

    const login = useGoogleLogin({
        onError: onFailure,
        onSuccess,
        flow: "auth-code",
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(" "),
    });

    return (
        <Box
            alignItems="center"
            background={COLORS.GRAY_LIGHT}
            height="100vh"
            justifyContent="center"
        >
            <Box alignItems="center">
                <Box alignItems="center" margin={{ bottom: 24 }}>
                    <Text bold fontSize={FONT_SIZE.XXXL}>
                        Kmail
                    </Text>
                </Box>
                <Box
                    background={COLORS.WHITE}
                    height={338}
                    margin="auto"
                    padding={44}
                    width={440}
                >
                    <Text bold fontSize={FONT_SIZE.XL}>
                        Sign in
                    </Text>
                    <Text fontSize={FONT_SIZE.M}>to continue to Kmail</Text>
                    <Button
                        background={COLORS.BLUE_DARK}
                        color={COLORS.WHITE}
                        onClick={login}
                        style={{
                            border: "none",
                            borderRadius: "0px",
                            fontSize: "15px",
                            fontWeight: 400,
                            marginTop: "10px",
                            padding: "4px 12px",
                            width: "auto",
                        }}
                    >
                        {authenticating
                            ? "Signing in..."
                            : "Sign in with Gmail"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
