import React, { createContext, useState, useContext } from 'react';
import { TextField, Button, Box } from '@mui/material';

const saveToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// Cria o contexto para a API Key
const ApiKeyContext = createContext();

// Provedor de contexto para a API Key
export const ApiKeyContextProvider = ({ children }) => {
    const [apiKey, setApiKey] = useState('');

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

// Hook personalizado para usar o contexto da API Key
export const useApiKeyContext = () => useContext(ApiKeyContext);

// Componente para inserir a API Key
export const ApiKeyInput = () => {
    const { apiKey, setApiKey } = useApiKeyContext();
    const [isVisible, setVisible] = useState(false);

    // Fecha o modal sem validação
    const closeModal = () => setVisible(false);

    // Valida a API Key e fecha o modal
    const validateAndClose = () => {
        if (apiKey !== "") {
            setVisible(false);
        } else {
            alert("Digite uma API Key ou clique fora do modal.");
        }
    };

    return (
        <>
            {/* Botão para abrir o modal */}
            <Button
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    padding: '12px 12px',
                    minWidth: '36px',
                    minHeight: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={() => setVisible(!isVisible)}
            >
                <i className="fa-solid fa-key" style={{ fontSize: 20 }} />
            </Button>

            {/* Modal com blur e centralização */}
            {isVisible && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo transparente
                        backdropFilter: 'blur(5px)', // Efeito de desfoque
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                    onClick={closeModal} // Fecha ao clicar fora
                >
                    {/* Caixa do TextField */}
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            width: '80%',
                            maxWidth: '400px',
                        }}
                        onClick={(e) => e.stopPropagation()} // Impede que o clique no campo feche o modal
                    >
                        <TextField
                            label="API Key"
                            variant="outlined"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                saveToLocalStorage('apiKey', e.target.value);
                            }}
                            placeholder="Insira sua API Key"
                            margin="normal"
                            fullWidth
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') validateAndClose(); // Valida e fecha ao pressionar Enter
                            }}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};
