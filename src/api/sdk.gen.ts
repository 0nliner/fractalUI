import axios from "axios";

export const checkIfTokenAlive = async (token: string) => {
    try {
        const response = await axios.get("/api/check-token", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

export const refreshAuthToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return null;

        const response = await axios.post("/api/refresh-token", { refreshToken });
        if (response.status === 200) {
            return response.data.accessToken;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

// 🔹 Авторизация через GitHub, Google, Yandex (OAuth2)
export const loginWithOAuth = async (provider: "github" | "google" | "yandex") => {
    window.location.href = `/api/oauth/${provider}`;
};

// После редиректа сервер отправляет accessToken и refreshToken. Их можно обработать так
// useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("accessToken");
//     if (token) {
//         localStorage.setItem("accessToken", token);
//         localStorage.setItem("refreshToken", params.get("refreshToken") || "");
//         setIsAuthenticated(true);
//     }
// }, []);

// Компонент входа Login.tsx
// import React, { useContext } from "react";
// import { AuthContext } from "../providers/AuthProvider";

// const Login = () => {
//     const auth = useContext(AuthContext);

//     return (
//         <div>
//             <h1>Вход</h1>
//             <button onClick={() => auth?.loginWithOAuth("github")}>Войти через GitHub</button>
//             <button onClick={() => auth?.loginWithOAuth("google")}>Войти через Google</button>
//             <button onClick={() => auth?.loginWithOAuth("yandex")}>Войти через Яндекс</button>
//         </div>
//     );
// };

// export default Login;
