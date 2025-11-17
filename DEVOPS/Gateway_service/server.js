
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Exemple de proxy vers service Auth
app.use('/api/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/api/auth': ''} // supprime /api/auth pour le service
}));

// Exemple de proxy vers service User
app.use('/api/users', createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/api/users': ''}
}));

app.use('/api/chat', createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/api/chat': ''}
}));

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});
