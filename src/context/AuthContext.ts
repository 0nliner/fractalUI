import { createContext } from "react";

export type AuthContextProps = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    exit: () => void;
};

export const authContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    exit: () => {},
});
