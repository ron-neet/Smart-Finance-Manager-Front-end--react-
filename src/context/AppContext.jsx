import { createContext, useState, useEffect } from "react";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage first, then system preference
        const stored = localStorage.getItem("darkMode");
        if (stored !== null) {
            return JSON.parse(stored);
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const clearUser = () => {
        setUser(null);
    };

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <AppContext.Provider value={{ user, setUser, clearUser, darkMode, toggleDarkMode }}>
            {children}
        </AppContext.Provider>
    );
};

