// src/services/api.js
import axios from 'axios';
import {toast} from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'; // Замените на ваш URL API

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Добавление JWT токена к каждому запросу, если он сохранен
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return  Promise.reject(error)
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        toast(error?.response?.data?.error,{
            type: "error",
            position: "top-right",
        })
        const statusCode = error.response ? error.response.status : null;
        if (statusCode === 401) {
            window.localStorage.clear();
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default api;
