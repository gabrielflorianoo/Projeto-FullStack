import { useState, useEffect } from 'react';

const useThemeSwitcher = (initialTheme = 'light') => {
    const [theme, setTheme] = useState(() => {
        // Retrieve the saved theme from localStorage, or use the initial theme
        return JSON.parse(localStorage.getItem('theme')) || initialTheme;
    });

    useEffect(() => {
        // Save the current theme to localStorage whenever it changes
        localStorage.setItem('theme', JSON.stringify(theme));
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return { theme, toggleTheme };
};

export default useThemeSwitcher;