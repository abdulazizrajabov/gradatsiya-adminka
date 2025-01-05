import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HistoryIcon from '@mui/icons-material/History';
import StoreIcon from '@mui/icons-material/Store';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <Drawer variant="permanent">
            <List>
                <ListItem button component={Link} to="/dashboard">
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Главная" />
                </ListItem>
                <ListItem button component={Link} to="/users">
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary="Пользователи" />
                </ListItem>
                <ListItem button component={Link} to="/classes">
                    <ListItemIcon><ClassIcon /></ListItemIcon>
                    <ListItemText primary="Классы" />
                </ListItem>
                <ListItem button component={Link} to="/rewards">
                    <ListItemIcon><EmojiEventsIcon /></ListItemIcon>
                    <ListItemText primary="Награды" />
                </ListItem>
                <ListItem button component={Link} to="/history">
                    <ListItemIcon><HistoryIcon /></ListItemIcon>
                    <ListItemText primary="История" />
                </ListItem>
                <ListItem button component={Link} to="/store">
                    <ListItemIcon><StoreIcon /></ListItemIcon>
                    <ListItemText primary="Магазин" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
