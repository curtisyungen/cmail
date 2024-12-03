import React, { useEffect } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import backgroundImage from "../assets/loginBackground.jpg";
import { Icon } from "../components/common";
import { useApi, useAppContext, useAuthentication } from "../hooks";
import { APP_NAME, PAGES, STATUS } from "../res";
import { ICON } from "../res/icons";
import { Box, Button, COLORS, Flex, FONT_SIZE, Text } from "../styles";

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
    const { authenticated, status } = useAppContext();
    const { checkAuthentication } = useAuthentication();

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
        authenticateUser(response.code);
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
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundPositionX: "50%",
                backgroundPositionY: "50%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <Box alignItems="center">
                <Box alignItems="center" margin={{ bottom: 12 }}>
                    <Text fontSize={FONT_SIZE.XXXL} semibold>
                        {APP_NAME}
                    </Text>
                </Box>
                <Box
                    background={COLORS.WHITE}
                    height={338}
                    justifyContent="space-between"
                    margin="auto"
                    padding={44}
                    style={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 6px 0px" }}
                    width={440}
                >
                    <Box>
                        <Box margin={{ bottom: 20 }}>
                            <Flex>
                                <Box
                                    background={COLORS.BLUE_DARK}
                                    height={23}
                                    margin={{ right: 5 }}
                                    width={23}
                                />
                                <Text
                                    color={COLORS.GRAY_DARK}
                                    fontSize={FONT_SIZE.XL}
                                    semibold
                                >
                                    Curtis Yungen
                                </Text>
                            </Flex>
                        </Box>
                        <Text fontSize={FONT_SIZE.XXL} semibold>
                            Sign in
                        </Text>
                        <Text fontSize={FONT_SIZE.M}>
                            to continue to {APP_NAME}
                        </Text>
                        <Box
                            margin={{ top: 20 }}
                            padding={{ bottom: 10 }}
                            style={{
                                borderBottomWidth: "1px",
                            }}
                        >
                            <Text
                                color={COLORS.GRAY_DARK}
                                fontSize={FONT_SIZE.L}
                            >
                                Clicking the button below will sign you in via
                                Gmail
                            </Text>
                        </Box>
                    </Box>
                    <Box alignItems="flex-end">
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
                                width: 108,
                            }}
                        >
                            {status === STATUS.AUTHENTICATING
                                ? "Signing in..."
                                : "Sign in"}
                        </Button>
                    </Box>
                </Box>
                <Box
                    background={COLORS.WHITE}
                    height={48}
                    margin={{
                        bottom: 66,
                        top: 20,
                    }}
                    padding={{ bottom: 8, left: 44, right: 44, top: 8 }}
                    style={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 6px 0px" }}
                    width={440}
                >
                    <Flex>
                        <Icon
                            color={COLORS.BLACK}
                            name={ICON.KEY}
                            size={20}
                            style={{
                                marginRight: "15px",
                                transform: "scaleX(-1)",
                            }}
                        />
                        <Text fontSize={FONT_SIZE.L}>
                            An exhaustively researched project for CS221
                        </Text>
                    </Flex>
                </Box>
            </Box>
            <Box
                background="rgba(0, 0, 0, 0.6)"
                height={46}
                style={{
                    bottom: 0,
                    position: "fixed",
                }}
            ></Box>
        </Box>
    );
};

export default Login;
