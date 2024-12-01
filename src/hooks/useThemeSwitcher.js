import { useState, useEffect } from 'react';

const useThemeSwitcher = (initialTheme = 'light') => {
    const [theme, setTheme] = useState(() => {
        // Recupera o tema salvo no localStorage ou usa o tema inicial
        return localStorage.getItem('theme') || initialTheme;
    });

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    useEffect(() => {
        // Salva o tema no localStorage sempre que ele muda
        localStorage.setItem('theme', theme);
    }, [theme]);

    return { theme, toggleTheme };
};

export default useThemeSwitcher;
