// src/pages/Classes.jsx
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentClass, setCurrentClass] = useState({ id: null, name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Ошибка при получении классов:', error);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleOpen = () => {
        setCurrentClass({ id: null, name: '' });
        setIsEditing(false);
        setOpen(true);
        setError('');
    };

    const handleEdit = (cls) => {
        setCurrentClass(cls);
        setIsEditing(true);
        setOpen(true);
        setError('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот класс?')) {
            try {
                await api.delete(`/classes/${id}`);
                fetchClasses();
            } catch (error) {
                console.error('Ошибка при удалении класса:', error);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
    };

    const handleChange = (e) => {
        setCurrentClass({ ...currentClass, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!currentClass.name.trim()) {
            setError('Название класса не может быть пустым.');
            return;
        }

        try {
            if (isEditing) {
                await api.put(`/classes/${currentClass.id}`, { name: currentClass.name });
            } else {
                await api.post('/classes', { name: currentClass.name });
            }
            fetchClasses();
            handleClose();
        } catch (error) {
            console.error('Ошибка при сохранении класса:', error);
            setError('Произошла ошибка при сохранении класса.');
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Typography variant="h4" gutterBottom>
                Классы
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: 16 }}>
                Добавить Класс
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {classes.map((cls) => (
                        <TableRow key={cls.id}>
                            <TableCell>{cls.id}</TableCell>
                            <TableCell>{cls.name}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEdit(cls)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(cls.id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Диалог для добавления/редактирования класса */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? 'Редактировать Класс' : 'Добавить Класс'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Название Класса"
                        name="name"
                        type="text"
                        fullWidth
                        value={currentClass.name}
                        onChange={handleChange}
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

export default Classes;
