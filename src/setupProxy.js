// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/', // Базовый путь API (если ваш API использует префикс /api)
        createProxyMiddleware({
            target: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000', // Замените на ваш URL API
            changeOrigin: true,
        })
    );
};
