// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post('/auth/login', {
                username: form.username,
                password: form.password,
            });
            const { token } = response.data;
            localStorage.setItem('jwtToken', token);
            navigate('/dashboard');
        } catch (err) {
            setError('Неверное имя пользователя или пароль.');
            console.error('Ошибка при логине:', err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper style={{ padding: 24, marginTop: 100 }}>
                <Typography variant="h5" gutterBottom>
                    Вход в Админ-Панель
                </Typography>
                {error && (
                    <Typography color="error" variant="body1">
                        {error}
                    </Typography>
                )}
                <TextField
                    label="Имя пользователя"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Пароль"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth style={{ marginTop: 16 }}>
                    Войти
                </Button>
            </Paper>
        </Container>
    );
};

export default LoginForm;
