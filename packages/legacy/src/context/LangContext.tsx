import { createContext, useContext, useState, useEffect } from "react";
//  еще пилится пока не трогаем ну его нахуй
type Language = "ru" | "en";
type LangContextType = {
    lang: Language;
    setLang: (lang: Language) => void;
    translations: Record<string, string>;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Language>((localStorage.getItem("lang") as Language) || "en");
    const [translations, setTranslations] = useState<Record<string, string>>({});

    useEffect(() => {
        localStorage.setItem("lang", lang);
        fetch(`/api/translations?lang=${lang}`)
            .then((res) => res.json())
            .then((data) => setTranslations(data))
            .catch(console.error);
    }, [lang]);

    return <LangContext.Provider value={{ lang, setLang, translations }}>{children}</LangContext.Provider>;
};

export const useLang = () => {
    const context = useContext(LangContext);
    if (!context) throw new Error("useLang must be used within a LangProvider");
    return context;
};

// usage example
// const { lang, setLang, translations } = useLang();

// <button onClick={() => setLang(lang === "en" ? "ru" : "en")}>
//   {translations["changeLanguage"]}
// </button>
// <p>{translations["hello"]}</p>
