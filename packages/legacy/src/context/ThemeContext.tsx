import { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>((localStorage.getItem("theme") as Theme) || "light");

    useEffect(() => {
        document.body.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};

// usage example
// const { theme, toggleTheme } = useTheme();
// <button onClick={toggleTheme}>Сменить тему ({theme})</button>
