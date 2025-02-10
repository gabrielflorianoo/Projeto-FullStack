import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import App from './App';
import Home from './components/Home';
import Login from './components/Login';
import Developers from './components/Developers';
import { ThemeContextProvider } from './context/ThemeContext';
import { ApiKeyContextProvider } from './context/ApiKeyContext';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeContextProvider>
            <ApiKeyContextProvider>
                <AuthProvider>
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/converter" element={<App />} />
                            <Route path="/creditos" element={<Developers />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/registrar" element={<Developers />} />
                            <Route path="*" element={<Navigate to="/" />} />
                            {/* Redireciona rotas que não existem */}
                        </Routes>
                    </HashRouter>
                </AuthProvider>
            </ApiKeyContextProvider>
        </ThemeContextProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
