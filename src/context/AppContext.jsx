
import { createContext, useState, useEffect } from "react";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const clearUser = () => {
        setUser(null);
        
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

    return (
        <AppContext.Provider value={{ user, setUser, clearUser }}>
            {children}
        </AppContext.Provider>
    );
};

