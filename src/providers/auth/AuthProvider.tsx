import React, { createContext, useEffect, useState, useCallback } from "react";
// import { checkIfTokenAlive, refreshAuthToken } from "../../api/sdk.gen";

import { AppProviderContext } from "../AppProvider";

interface AuthContextProps {
    isAuthenticated: boolean;
    exit: () => void;
    authRequired?: boolean;
    checkIfTokenAlive?: (authToken: string, exit: () => void) => Promise<boolean>;
    refreshAuthToken?: refreshAuthTokenType
}


export const AuthContext = createContext<AuthContextProps>({isAuthenticated: false, exit: () => {}, authRequired: false});


type queryPayload = {token: string}
type checkIfExpiredPayload = {query: queryPayload}
type refreshAuthTokenType = () => Promise<any>


export type AuthProviderProps = {
    checkIfExpired?: (props: checkIfExpiredPayload) => Promise<boolean>,
    refreshAuthToken?: refreshAuthTokenType, 
    SignInPage?: React.FC<any>
    children: React.ReactNode
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children, checkIfExpired, SignInPage, refreshAuthToken }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("accessToken"));
    const appProviderConfig = React.useContext(AppProviderContext);

    useEffect(() => {
        const authToken = localStorage.getItem("accessToken");
        if (!authToken) return;

        setIsAuthenticated(true);
        const interval = setInterval(() => validateToken(authToken), 10_000);
        return () => clearInterval(interval);
    }, []);

    const validateToken = useCallback(async (token: string) => {
        const isAlive = await checkIfTokenAlive(token);

        if (!isAlive) {
            const newToken = await refreshAuthToken();
            if (newToken) {
                localStorage.setItem("accessToken", newToken);
                setIsAuthenticated(true);
            } else {
                exit();
            }
        }
    }, []);


    const checkIfTokenAlive = async (authToken: string) => {
        if (!checkIfExpired) {
            return false;
        }
        const response = await checkIfExpired({ query: { token: authToken } });
        // @ts-ignore
        if (!response.data) {
            exit();
            return false;
        }

        return true;
    };


    const exit = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
    }, []);

    return <>{
        // @ts-ignore
        isAuthenticated || !appProviderConfig.authConfig.authRequired ? (
            <AuthContext.Provider value={{ isAuthenticated, exit, authRequired: true, checkIfTokenAlive }}>
                {children}
            </AuthContext.Provider>
        ) : (
            <SignInPage/>
        )}
        </>
};
