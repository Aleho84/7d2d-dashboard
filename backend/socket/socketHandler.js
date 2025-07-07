const { Server } = require('socket.io');
const { corsOrigin } = require('../config');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: corsOrigin,
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return io;
}

module.exports = { initializeSocket };
