import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Синий цвет
        },
        secondary: {
            main: '#dc004e', // Красный цвет
        },
    },
    typography: {
        h5: {
            fontWeight: 600,
        },
    },
});

export default theme;
