import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        telegram_id: '',
        full_name: '',
        role: 'student',
        class_id: '',
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setForm({
            telegram_id: '',
            full_name: '',
            role: 'student',
            class_id: '',
        });
        setOpen(false);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await api.post('/users', {
                telegram_id: parseInt(form.telegram_id),
                full_name: form.full_name,
                role: form.role,
                class_id: form.class_id ? parseInt(form.class_id) : null,
            });
            fetchUsers();
            handleClose();
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Typography variant="h4" gutterBottom>
                Пользователи
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: 16 }}>
                Добавить Пользователя
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Telegram ID</TableCell>
                        <TableCell>Имя</TableCell>
                        <TableCell>Роль</TableCell>
                        <TableCell>ID Класса</TableCell>
                        <TableCell>Баллы</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.telegram_id}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.class_id || '-'}</TableCell>
                            <TableCell>{user.total_points || '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Диалог для добавления пользователя */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Добавить Пользователя</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Telegram ID"
                        name="telegram_id"
                        type="number"
                        fullWidth
                        value={form.telegram_id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Полное Имя"
                        name="full_name"
                        type="text"
                        fullWidth
                        value={form.full_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Роль"
                        name="role"
                        type="text"
                        fullWidth
                        value={form.role}
                        onChange={handleChange}
                        helperText="student или teacher"
                    />
                    {form.role === 'student' && (
                        <TextField
                            margin="dense"
                            label="ID Класса"
                            name="class_id"
                            type="number"
                            fullWidth
                            value={form.class_id}
                            onChange={handleChange}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Users;
