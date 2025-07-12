const { Server } = require('socket.io');
const { corsOrigin } = require('../config');
const os = require('os');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: corsOrigin,
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`[${new Date().toLocaleString()}] a user connected`);
        
        // Emit hardware info on connection and then every 30 seconds
        emitHardwareInfo(socket);
        const interval = setInterval(() => emitHardwareInfo(socket), 30000);

        socket.on('disconnect', () => {
            console.log(`[${new Date().toLocaleString()}] user disconnected`);
            clearInterval(interval);
        });
    });

    return io;
}

function emitHardwareInfo(socket) {
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : "N/A";
    const totalMemoryGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const freeMemoryGB = (os.freemem() / (1024 ** 3)).toFixed(2);

    const hardwareInfo = {
        cpu: cpuModel,
        ram: {
            total: `${totalMemoryGB} GB`,
            free: `${freeMemoryGB} GB`
        }
    };

    socket.emit('hardware-info', hardwareInfo);
}

module.exports = { initializeSocket };
