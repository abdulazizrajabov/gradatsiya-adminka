import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

ReactDOM.render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
