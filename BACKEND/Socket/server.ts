 const express = require('express');
    const http = require('http');
    const { Server } = require('socket.io');

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Replace with your frontend URL
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('sendMessage', (data) => {
            io.emit('receiveMessage', data); // Broadcast to all connected clients
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected', socket.id);
        });
    });

    server.listen(3001, () => { // Or any other port
        console.log('Server running on port 3001');
    });
