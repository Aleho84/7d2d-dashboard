const express = require('express');
const cors = require('cors');
const {getServerIP} = require('./utils/getServerIP');
const http = require('http');
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
    let ipAddress = getServerIP();
    console.log(`[${new Date().toLocaleString()}] Backend server listening at http://${ipAddress}:${serverPort}`);
});