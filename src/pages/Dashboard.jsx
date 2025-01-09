// src/pages/Dashboard.jsx
import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import api from '../services/api';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        classes: 0,
        rewards: 0,
        storeItems: 0,
        transactions: 0,
    });

    useEffect(() => {
        // Пример получения статистики (реализуйте соответствующие эндпоинты)
        const fetchStats = async () => {
            try {
                const [users, classes, rewards, storeItems, transactions] = await Promise.all([
                    api.get('/students'),
                    api.get('/classes'),
                    api.get('/rewards'),
                    api.get('/store/items'),
                    // api.get('/history'),
                ]);
                setStats({
                    users: users.data.length,
                    classes: classes.data.length,
                    rewards: rewards.data.length,
                    storeItems: storeItems.data.length,
                    transactions: transactions?.data?.length ?? 0,
                });
            } catch (error) {
                console.error('Ошибка при получении статистики:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <Typography variant="h4" gutterBottom>
                Главная
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6">Пользователи</Typography>
                        <Typography variant="h4">{stats.users}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6">Классы</Typography>
                        <Typography variant="h4">{stats.classes}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6">Награды</Typography>
                        <Typography variant="h4">{stats.rewards}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6">Магазин</Typography>
                        <Typography variant="h4">{stats.storeItems}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6">Транзакции</Typography>
                        <Typography variant="h4">{stats.transactions}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
