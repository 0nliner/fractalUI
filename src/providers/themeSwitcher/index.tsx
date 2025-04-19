import React, { createContext, useState, useMemo, useCallback, useEffect, useContext } from "react";
import { ThemeProvider, createTheme, ThemeOptions } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ReactDOM from "react-dom";

// 1. Создаём контекст для управления темой
interface ColorModeContextProps {
    toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextProps>({
    toggleColorMode: () => {},
});

// 2. Создаём провайдер, который будет управлять состоянием темы
const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isSystemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Определяем начальный режим темы
    const [mode, setMode] = useState<"light" | "dark">(() => {
        const userPreviousMode = localStorage.getItem("mode");
        return userPreviousMode ? (userPreviousMode as "light" | "dark") : isSystemDarkMode ? "dark" : "light";
    });

    // Создаём функцию переключения темы
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    // Настройка темы
    const themeOptions: ThemeOptions = useMemo(
        () => ({
            palette: {
                primary: {
                    main: "rgb(53, 118, 102)",
                },
                secondary: {
                    main: "rgb(62, 99, 90)",
                },
                mode,
            },
            components: {
                MuiCard: {
                    styleOverrides: {
                      root: {
                        backgroundColor: '#252525', // Светло-серый цвет
                        // color: '#000', // Цвет текста (по желанию)
                        // padding: '16px', // Добавляем внутренний отступ
                        borderRadius: '13px', // Опционально: добавляем скругление углов
                      },
                    }
                }
            }
        }),
        [mode]
    );

    // Сохраняем текущий режим в localStorage
    useEffect(() => {
        localStorage.setItem("mode", mode);
    }, [mode]);

    // Проверяем сохранённый режим при монтировании компонента
    useEffect(() => {
        const savedMode = localStorage.getItem("mode");
        if (savedMode) {
            setMode(savedMode as "light" | "dark");
        }
    }, []);

    // Создаём тему
    const theme = createTheme(themeOptions);

    // Состояние для проверки загрузки заголовка
    const [isLoading, setIsLoading] = useState(true);

    // Функция проверки наличия элемента
    const checkIfHeaderLoaded = useCallback(() => {
        const node = document.getElementById("headerNavPortalRoot");
        if (node) {
            setIsLoading(false);
        }
    }, []);

    // Периодическая проверка загрузки заголовка
    useEffect(() => {
        const timeout = setTimeout(() => {
            checkIfHeaderLoaded();
        }, 500);

        return () => clearTimeout(timeout); // Очищаем интервал при размонтировании
    }, []);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {/* Отображаем кнопку переключения темы через портал */}
                {!isLoading && document.getElementById("headerNavPortalRoot") && (
                    ReactDOM.createPortal(
                        <ThemeToggleButton />,
                        document.getElementById("headerNavPortalRoot")!
                    )
                )}
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

// 3. Хук для удобного доступа к функции переключения темы
export const useColorMode = () => {
    return useContext(ColorModeContext);
};

// 4. Пример кнопки переключения темы
const ThemeToggleButton: React.FC = () => {
    const { toggleColorMode } = useColorMode();

    return (
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit" aria-label="toggle theme">
            {/* В реальном приложении можно дополнительно проверять текущий режим, 
          чтобы показывать разную иконку. Здесь просто демонстрация функционала. */}
            <Brightness4Icon />
        </IconButton>
    );
};

export { ColorModeProvider, ThemeToggleButton };