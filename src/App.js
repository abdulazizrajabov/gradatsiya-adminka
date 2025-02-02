// src/App.js
import React, {useEffect, useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Classes from './pages/Classes';
import Rewards from './pages/Rewards';
import History from './pages/History';
import Store from './pages/Store';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import {ToastContainer} from "react-toastify";

const App = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        setToken(localStorage.getItem('jwtToken'));
    }, [localStorage.getItem('jwtToken')]);

    return (
        <div style={{ display: 'flex', paddingLeft: 200}}>
            <ToastContainer/>
            <CssBaseline />
            {/* Показываем Sidebar только если пользователь аутентифицирован */}
            {token && <Sidebar />}
            <div style={{ flexGrow: 1 }}>
                {token && <Header />}
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <Users />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/classes"
                        element={
                            <ProtectedRoute>
                                <Classes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/rewards"
                        element={
                            <ProtectedRoute>
                                <Rewards />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <History />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/store"
                        element={
                            <ProtectedRoute>
                                <Store />
                            </ProtectedRoute>
                        }
                    />
                    {/* Редирект на /dashboard или /login в зависимости от аутентификации */}
                    <Route
                        path="*"
                        element={
                            token ? (
                                <Dashboard />
                            ) : (
                                <LoginForm />
                            )
                        }
                    />
                </Routes>
            </div>
        </div>
    );
};

export default App;
