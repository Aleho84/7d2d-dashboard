const chokidar = require('chokidar');
const path = require('path');
const { logsDir } = require('../config');
const { parseLogFile } = require('./logParser');
const { getLatestLogFile } = require('./logFinder');
const { sendDiscordNotification, sendServerStatusNotification } = require('./discordNotifier');

// Cache para almacenar el último estado conocido de los jugadores y del servidor
let playerStateCache = new Map();
let lastServerStatus = null;

function startLogWatcher(io) {
    const watcher = chokidar.watch(logsDir, {
        ignored: /(^|[\/])\../,
        persistent: true,
        ignoreInitial: true,
    });

    const processPlayerStateChanges = (newPlayers) => {
        const newPlayerMap = new Map(newPlayers.map(p => [p.name, p.status]));

        // Comprobar cambios de estado y nuevos jugadores
        newPlayerMap.forEach((status, name) => {
            const oldStatus = playerStateCache.get(name);
            if (oldStatus !== status) {
                let statusMessage;
                switch (status) {
                    case 'Online':
                        statusMessage = `:white_check_mark: **${name}** ha entrado al juego.`;
                        sendDiscordNotification(statusMessage);
                        break;
                    case 'Offline':
                        statusMessage = `:octagonal_sign: **${name}** se ha desconectado.`;
                        sendDiscordNotification(statusMessage);
                        break;
                    case 'Connected':
                        // Opcional: notificar cuando alguien se conecta al lobby
                        break;
                }
            }
        });

        // Comprobar si algún jugador se ha desconectado (ya no está en la nueva lista)
        playerStateCache.forEach((status, name) => {
            if (!newPlayerMap.has(name)) {
                const statusMessage = `:octagonal_sign: **${name}** se ha desconectado.`;
                sendDiscordNotification(statusMessage);
            }
        });

        // Actualizar el caché
        playerStateCache = newPlayerMap;
    };

    const processServerStatusChange = (newStatus) => {
        // Solo notificar si el estado ha cambiado y no es la primera vez que se detecta
        if (lastServerStatus !== null && lastServerStatus !== newStatus) {
            console.log(`[${new Date().toLocaleString()}] Server status changed from ${lastServerStatus} to ${newStatus}. Sending notification.`);
            sendServerStatusNotification(newStatus);
        }
        // Actualizar el último estado conocido
        lastServerStatus = newStatus;
    };

    const emitLogUpdate = async (filePath) => {
        console.log(`[${new Date().toLocaleString()}] Log file updated`);
        try {
            const data = await parseLogFile(filePath);
            io.emit('log-update', data);

            if (data.players) {
                processPlayerStateChanges(data.players);
            }
            if (data.serverStatus) {
                processServerStatusChange(data.serverStatus);
            }

        } catch (error) {
            console.error(`[${new Date().toLocaleString()}] Error al parsear o emitir el log ${filePath}:`, error);
            io.emit('log-error', { file: filePath, message: error.message });
        }
    };

    const pollLatestLog = async () => {
        try {
            const latestLogFile = await getLatestLogFile();
            if (latestLogFile) {
                console.log(`[${new Date().toLocaleString()}] Polling`);
                await emitLogUpdate(latestLogFile);
            }
        } catch (error) {
            console.error(`[${new Date().toLocaleString()}] Error durante el polling del log más reciente:`, error);
        }
    };

    watcher.on('add', async (filePath) => {
        if (filePath.startsWith(path.join(logsDir, 'output_log_dedi__'))) {
            console.log(`[${new Date().toLocaleString()}] New log file detected: ${filePath}`);
            const latestLogFile = await getLatestLogFile();
            if (filePath === latestLogFile) {
                await emitLogUpdate(filePath);
            }
        }
    });

    watcher.on('change', async (filePath) => {
        const latestLogFile = await getLatestLogFile();
        if (filePath === latestLogFile) {
            await emitLogUpdate(filePath);
        }
    });

    const pollingInterval = setInterval(pollLatestLog, 30000);
    
    // Sondeo inicial para poblar el caché
    pollLatestLog();

    return { watcher, pollingInterval };
}

module.exports = { startLogWatcher };