const express = require('express');
const cors = require('cors');
const http = require('http');
const os = require('os');
const { serverPort, corsOrigin } = require('./config');
const { initializeSocket } = require('./socket/socketHandler');
const { startLogWatcher } = require('./services/logWatcher');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors({ origin: corsOrigin }));

const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Start watching for log file changes
startLogWatcher(io);

// Use API routes
app.use('/api', apiRoutes);

server.listen(serverPort, () => {
    const networkInterfaces = os.networkInterfaces();
    let ipAddress = 'localhost';

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddress = iface.address;
                break;
            }
        }
        if (ipAddress !== 'localhost') break;
    }

    console.log(`[${new Date().toLocaleString()}] Backend server listening at http://${ipAddress}:${serverPort}`);
});