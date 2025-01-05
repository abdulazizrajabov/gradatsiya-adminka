// src/pages/Store.jsx
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

const Store = () => {
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState({
        id: null,
        name: '',
        description: '',
        price: '',
        quantity: '',
        is_active: true,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const fetchItems = async () => {
        try {
            const response = await api.get('/store/items');
            setItems(response.data);
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleOpen = () => {
        setCurrentItem({
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

    const handleEdit = (item) => {
        setCurrentItem(item);
        setIsEditing(true);
        setOpen(true);
        setError('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                await api.delete(`/store/items/${id}`);
                fetchItems();
            } catch (error) {
                console.error('Ошибка при удалении товара:', error);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentItem({
            ...currentItem,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async () => {
        const { name, description, price, quantity, is_active } = currentItem;

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
                await api.put(`/store/items/${currentItem.id}`, {
                    name,
                    description,
                    price: parseInt(price),
                    quantity: parseInt(quantity),
                    is_active,
                });
            } else {
                await api.post('/store/items', {
                    name,
                    description,
                    price: parseInt(price),
                    quantity: parseInt(quantity),
                    is_active,
                });
            }
            fetchItems();
            handleClose();
        } catch (error) {
            console.error('Ошибка при сохранении товара:', error);
            setError('Произошла ошибка при сохранении товара.');
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Typography variant="h4" gutterBottom>
                Магазин
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: 16 }}>
                Добавить Товар
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Описание</TableCell>
                        <TableCell>Цена (баллы)</TableCell>
                        <TableCell>Количество</TableCell>
                        <TableCell>Активен</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.is_active ? 'Да' : 'Нет'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEdit(item)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(item.id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Диалог для добавления/редактирования товара */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Редактировать Товар' : 'Добавить Товар'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Название"
                        name="name"
                        type="text"
                        fullWidth
                        value={currentItem.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Описание"
                        name="description"
                        type="text"
                        fullWidth
                        value={currentItem.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Цена (баллы)"
                        name="price"
                        type="number"
                        fullWidth
                        value={currentItem.price}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Количество"
                        name="quantity"
                        type="number"
                        fullWidth
                        value={currentItem.quantity}
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={currentItem.is_active}
                                onChange={handleChange}
                                name="is_active"
                                color="primary"
                            />
                        }
                        label="Активен"
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

export default Store;
