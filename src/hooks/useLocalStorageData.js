import { useState, useEffect } from 'react';

// Custom hook que retorna os dados armazenados no armazenamento local.
function useLocalStorage(variableName) {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Checa se há dados no armazenamento local
        const dataFromStorage = localStorage.getItem(variableName);

        if (dataFromStorage) {
            // Se houver, atualiza o estado
            setData(JSON.parse(dataFromStorage));
        } else {
            // Se não houver, retorna null
            setData(null);
        }
    }, []);

    return data;
}

export default useLocalStorage;
