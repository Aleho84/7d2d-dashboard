const express = require('express');
const cors = require('cors');
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
    console.log(`Backend server listening at http://localhost:${serverPort}`);
});