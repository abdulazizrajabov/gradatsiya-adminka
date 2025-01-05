// src/pages/History.jsx
import React, { useEffect, useState } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import api from '../services/api';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({
        student_id: '',
        teacher_id: '',
        type: '',
        date_from: '',
        date_to: '',
    });

    const fetchTransactions = async () => {
        try {
            const params = {};
            if (filters.student_id) params.student_id = filters.student_id;
            if (filters.teacher_id) params.teacher_id = filters.teacher_id;
            if (filters.type) params.type = filters.type;
            if (filters.date_from) params.date_from = filters.date_from;
            if (filters.date_to) params.date_to = filters.date_to;

            const response = await api.get('/history', { params });
            setTransactions(response.data);
        } catch (error) {
            console.error('Ошибка при получении истории:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        fetchTransactions();
    };

    const resetFilters = () => {
        setFilters({
            student_id: '',
            teacher_id: '',
            type: '',
            date_from: '',
            date_to: '',
        });
        fetchTransactions();
    };

    return (
        <div style={{ padding: 24 }}>
            <Typography variant="h4" gutterBottom>
                История Транзакций
            </Typography>

            {/* Фильтры */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <TextField
                    label="ID Ученик"
                    name="student_id"
                    type="number"
                    value={filters.student_id}
                    onChange={handleFilterChange}
                />
                <TextField
                    label="ID Учитель"
                    name="teacher_id"
                    type="number"
                    value={filters.teacher_id}
                    onChange={handleFilterChange}
                />
                <FormControl style={{ minWidth: 150 }}>
                    <InputLabel>Тип</InputLabel>
                    <Select name="type" value={filters.type} onChange={handleFilterChange}>
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value="purchase_request">Запрос на Покупку</MenuItem>
                        <MenuItem value="purchase">Покупка</MenuItem>
                        <MenuItem value="purchase_rejected">Покупка Отклонена</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Дата От"
                    name="date_from"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.date_from}
                    onChange={handleFilterChange}
                />
                <TextField
                    label="Дата До"
                    name="date_to"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.date_to}
                    onChange={handleFilterChange}
                />
                <Button variant="contained" color="primary" onClick={applyFilters}>
                    Применить
                </Button>
                <Button variant="outlined" onClick={resetFilters}>
                    Сбросить
                </Button>
            </div>

            {/* Таблица транзакций */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>ID Ученик</TableCell>
                        <TableCell>ID Учитель</TableCell>
                        <TableCell>ID Товара</TableCell>
                        <TableCell>Количество</TableCell>
                        <TableCell>Баллы</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Причина</TableCell>
                        <TableCell>Дата Создания</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((txn) => (
                        <TableRow key={txn.id}>
                            <TableCell>{txn.id}</TableCell>
                            <TableCell>{txn.student_id}</TableCell>
                            <TableCell>{txn.teacher_id || '-'}</TableCell>
                            <TableCell>{txn.item_id || '-'}</TableCell>
                            <TableCell>{txn.quantity || '-'}</TableCell>
                            <TableCell>{txn.points || '-'}</TableCell>
                            <TableCell>{txn.type}</TableCell>
                            <TableCell>{txn.reason}</TableCell>
                            <TableCell>{new Date(txn.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default History;
