import { useState } from 'react';

function useLocalStorage(key, initialValue = null) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Erro ao acessar o localStorage:', error);
            return initialValue;
        }
    });

    return storedValue;
}

export default useLocalStorage;
