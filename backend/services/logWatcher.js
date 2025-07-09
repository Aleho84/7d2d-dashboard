const chokidar = require('chokidar');
const path = require('path');
const { logsDir } = require('../config');
const { parseLogFile } = require('./logParser');
const { getLatestLogFile } = require('./logFinder');
const { sendDiscordNotification } = require('./discordNotifier');

// Cache to store the last known state of players
let playerStateCache = new Map();

function startLogWatcher(io) {
    const watcher = chokidar.watch(logsDir, {
        ignored: /(^|[\/])\../,
        persistent: true,
        ignoreInitial: true,
    });

    const processPlayerStateChanges = (newPlayers) => {
        const newPlayerMap = new Map(newPlayers.map(p => [p.name, p]));

        // Check for status changes and new players
        newPlayerMap.forEach((newPlayer, name) => {
            const oldPlayer = playerStateCache.get(name);
            if (!oldPlayer) {
                // New player detected                
            } else if (oldPlayer.status !== newPlayer.status) {
                // Player status has changed
                let statusMessage;
                switch (newPlayer.status) {
                    case 'Online':
                        statusMessage = `:white_check_mark: **${name}** ha entrado al juego.`;
                        sendDiscordNotification(statusMessage);
                        break;
                    case 'Offline':
                        statusMessage = `:octagonal_sign: **${name}** se ha desconectado.`;
                        sendDiscordNotification(statusMessage);
                        break;
                    case 'Connected':
                        //sendDiscordNotification(`:arrow_right: **${name}** se ha conectado.`);
                        break;
                }
            }
        });

        // Update the cache
        playerStateCache = newPlayerMap;
    };

    const emitLogUpdate = async (filePath) => {
        console.log(`[${new Date().toLocaleString()}] Log file updated`);
        try {
            const data = await parseLogFile(filePath);
            io.emit('log-update', data);
            if (data.players) {
                processPlayerStateChanges(data.players);
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
    
    // Initial poll to populate cache
    pollLatestLog();

    return { watcher, pollingInterval };
}

module.exports = { startLogWatcher };