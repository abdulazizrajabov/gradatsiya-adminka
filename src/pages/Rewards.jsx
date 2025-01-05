// src/pages/Rewards.jsx
import React, { useEffect, useState } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    IconButton,
    Switch,
    FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentReward, setCurrentReward] = useState({
        id: null,
        name: '',
        description: '',
        price: '',
        quantity: '',
        is_active: true,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const fetchRewards = async () => {
        try {
            const response = await api.get('/rewards');
            setRewards(response.data);
        } catch (error) {
            console.error('Ошибка при получении наград:', error);
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    const handleOpen = () => {
        setCurrentReward({
            id: null,
            name: '',
            description: '',
            price: '',
            quantity: '',
            is_active: true,
        });
        setIsEditing(false);
        setOpen(true);
        setError('');
    };

    const handleEdit = (reward) => {
        setCurrentReward(reward);
        setIsEditing(true);
        setOpen(true);
        setError('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту награду?')) {
            try {
                await api.delete(`/rewards/${id}`);
                fetchRewards();
            } catch (error) {
                console.error('Ошибка при удалении награды:', error);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentReward({
            ...currentReward,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async () => {
        const { name, description, price, quantity, is_active } = currentReward;

        if (!name.trim() || !description.trim() || price === '' || quantity === '') {
            setError('Все поля обязательны и должны быть заполнены.');
            return;
        }

        if (isNaN(price) || isNaN(quantity)) {
            setError('Поля "Цена" и "Количество" должны быть числами.');
            return;
        }

        try {
            if (isEditing) {
                await api.put(`/rewards/${currentReward.id}`, {
                    name,
                    description,
                    price: parseInt(price),
                    quantity: parseInt(quantity),
                    is_active,
                });
            } else {
                await api.post('/rewards', {
                    name,
                    description,
                    price: parseInt(price),
                    quantity: parseInt(quantity),
                    is_active,
                });
            }
            fetchRewards();
            handleClose();
        } catch (error) {
            console.error('Ошибка при сохранении награды:', error);
            setError('Произошла ошибка при сохранении награды.');
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Typography variant="h4" gutterBottom>
                Награды
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: 16 }}>
                Добавить Награду
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Описание</TableCell>
                        <TableCell>Цена (баллы)</TableCell>
                        <TableCell>Количество</TableCell>
                        <TableCell>Активна</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rewards.map((reward) => (
                        <TableRow key={reward.id}>
                            <TableCell>{reward.id}</TableCell>
                            <TableCell>{reward.name}</TableCell>
                            <TableCell>{reward.description}</TableCell>
                            <TableCell>{reward.price}</TableCell>
                            <TableCell>{reward.quantity}</TableCell>
                            <TableCell>{reward.is_active ? 'Да' : 'Нет'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEdit(reward)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(reward.id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Диалог для добавления/редактирования награды */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Редактировать Награду' : 'Добавить Награду'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Название"
                        name="name"
                        type="text"
                        fullWidth
                        value={currentReward.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Описание"
                        name="description"
                        type="text"
                        fullWidth
                        value={currentReward.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Цена (баллы)"
                        name="price"
                        type="number"
                        fullWidth
                        value={currentReward.price}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Количество"
                        name="quantity"
                        type="number"
                        fullWidth
                        value={currentReward.quantity}
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={currentReward.is_active}
                                onChange={handleChange}
                                name="is_active"
                                color="primary"
                            />
                        }
                        label="Активна"
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {isEditing ? 'Сохранить' : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Rewards;
