const express = require('express');
const cors = require('cors');
const { getServerIP } = require('./utils/getServerIP');
const http = require('http');
const { serverPort, corsOrigin } = require('./config');
const { initializeSocket } = require('./socket/socketHandler');
const { startLogWatcher } = require('./services/logWatcher');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ extended: false }));

const server = http.createServer(app);

// Inicializa Socket.IO
const io = initializeSocket(server);

// Comienza a observar los logs del servidor
startLogWatcher(io);

// Rutas de la API
app.use('/',
    async (req, res) => {
        res.json('Welcome to the 7 Days to Die Dashboard API');
    }
);
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Inicializa el servidor
server.listen(serverPort, () => {
    let ipAddress = getServerIP();
    console.log(`[${new Date().toLocaleString()}] Backend server listening at http://${ipAddress}:${serverPort}`);
});