import React, {use, useEffect, useState} from 'react';
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
import {Add, Edit} from "@mui/icons-material";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [rewards,setRewards] = useState([]);
    const [open, setOpen] = useState(false);
    const [addingIsOpen, setAddingIsOpen] = useState(null);
    const [filterType, setFilterType] = useState('all')
    const [selectedReward, setSelectedReward] = useState(null)
    const [reason,setReason] = useState('')
    const [selected,setSelected] = useState(null)

    const [form, setForm] = useState({
        telegram_id: '',
        telegram_id2: '',
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
            telegram_id2: '',
            full_name: '',
            role: 'student',
            class_id: '',
        });
        setSelected(null)
        setOpen(false);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (!selected) {
                await api.post('/students', {
                    telegram_id: parseInt(form.telegram_id),
                    telegram_id2: parseInt(form.telegram_id2),
                    full_name: form.full_name,
                    role: form.role,
                    class_id: form.class_id ? parseInt(form.class_id) : null,
                    password: form.password,
                });
            }else {
                await api.put(`/students/${selected}`, {
                    telegram_id: parseInt(form.telegram_id),
                    telegram_id2: parseInt(form.telegram_id2),
                    full_name: form.full_name,
                    role: form.role,
                    class_id: form.class_id ? parseInt(form.class_id) : null,
                });
            }
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
                        <TableCell>Telegram ID 2</TableCell>
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
                            <TableCell>{user.telegram_id2}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.class_id ?? '-'}</TableCell>
                            <TableCell>{user.total_points ?? '-'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => setAddingIsOpen({userId:user.id,chatId:user.telegram_id})} color="primary">
                                    <Add />
                                </IconButton>
                                <IconButton onClick={() => {
                                    handleOpen()
                                    setSelected(user.id)
                                    setForm({
                                        telegram_id: user.telegram_id,
                                        telegram_id2: user.telegram_id2,
                                        full_name: user.full_name,
                                        role: user.role,
                                        class_id: user.class_id,
                                    })
                                }} color="primary">
                                    <Edit />
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
                <DialogTitle> {!!!selected ? "Добавить Пользователя" : "Edit Пользователя"}</DialogTitle>
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
                        label="Telegram ID 2"
                        name="telegram_id2"
                        type="number"
                        fullWidth
                        value={form.telegram_id2}
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
                    ) : ( !!selected &&
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
                        {!!!selected ? "Добавить" : "Edit"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Users;
