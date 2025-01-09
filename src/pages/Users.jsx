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
    FormControl, RadioGroup, FormControlLabel, Radio, Select, MenuItem, TextareaAutosize
} from '@mui/material';
import api from '../services/api';
import {Add} from "@mui/icons-material";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [rewards,setRewards] = useState([]);
    const [open, setOpen] = useState(false);
    const [addingIsOpen, setAddingIsOpen] = useState(null);
    const [filterType, setFilterType] = useState('all')
    const [selectedReward, setSelectedReward] = useState(null)
    const [reason,setReason] = useState('')

    const [form, setForm] = useState({
        telegram_id: '',
        full_name: '',
        role: 'student',
        class_id: '',
        password: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/students');
            setUsers(response.data);
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
        }
    };

    const fetchReward = async () => {
        try {
            const response = await api.get('/rewards',{
                params: {
                    filterType: filterType === 'all' ? null : filterType
                }
            });
            setRewards(response.data);
        } catch (error) {
            console.error('Ошибка при получении rewards:', error);
        }
    };

    useEffect(() => {
        fetchReward();
    }, [filterType]);

    useEffect(() => {
        fetchUsers();
        fetchReward()
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
            await api.post('/students', {
                telegram_id: parseInt(form.telegram_id),
                full_name: form.full_name,
                role: form.role,
                class_id: form.class_id ? parseInt(form.class_id) : null,
                password: form.password,
            });
            fetchUsers();
            handleClose();
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
        }
    };

    const handleAdd = async () => {
        if (!!selectedReward) {
            try {
                await api.post('/students/reward-add', {
                    rewardId: +selectedReward,
                    userId: +addingIsOpen.userId,
                    chatId: `${addingIsOpen.chatId}`,
                    reason
                });
                fetchUsers();
                setAddingIsOpen(null)
            } catch (error) {
                console.error('Error in adding reward:', error);
            }
        }
    }

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
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.telegram_id}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.class_id ?? '-'}</TableCell>
                            <TableCell>{user.total_points ?? '-'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => setAddingIsOpen({userId:user.id,chatId:user.telegram_id})} color="primary">
                                    <Add />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={!!addingIsOpen} onClose={() => setAddingIsOpen(null)} fullWidth>
                <DialogTitle>Statya tanlash</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Select
                            variant={"filled"}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filterType}
                            label="Filter"
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <MenuItem value={'all'}>All</MenuItem>
                            <MenuItem value={'bonus'}>Bonus</MenuItem>
                            <MenuItem value={'penalty'}>Penalty</MenuItem>
                        </Select>
                        <FormControl>
                            <RadioGroup
                                onChange={(e) => setSelectedReward(e.target.value)}
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                {
                                    rewards?.map(reward => (
                                        <FormControlLabel
                                            key={reward?.id}
                                            value={reward?.id}
                                            control={<Radio />}
                                            label={`${reward?.name} (${reward?.type === 'penalty' ? "-" : "+"}${reward?.points})`} />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>
                        <TextareaAutosize
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={"Prichina"}
                            style={{minHeight: 50}}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddingIsOpen(null)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
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
                    {form.role === 'student' ? (
                        <TextField
                            margin="dense"
                            label="ID Класса"
                            name="class_id"
                            type="number"
                            fullWidth
                            value={form.class_id}
                            onChange={handleChange}
                        />
                    ) : (
                        <TextField
                            margin="dense"
                            label="Парол"
                            name="password"
                            type="password"
                            fullWidth
                            value={form.password}
                            onChange={handleChange}
                            helperText="password"
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
