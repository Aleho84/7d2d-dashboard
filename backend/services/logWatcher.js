const chokidar = require('chokidar');
const path = require('path');
const { logsDir } = require('../config');
const { parseLogFile } = require('./logParser');
const { getLatestLogFile } = require('./logFinder');

function startLogWatcher(io) {
    const watcher = chokidar.watch(
        logsDir, {
        ignored: /(^|[\/])\../,
        persistent: true,
        ignoreInitial: true,
    });

    const emitLogUpdate = async (filePath) => {
        console.log(`[${new Date().toLocaleString()}] Log file updated`);
        try {
            const data = await parseLogFile(filePath);
            io.emit('log-update', data);
        } catch (error) {
            console.error(`[${new Date().toLocaleString()}] Error al parsear o emitir el log ${filePath}:`, error);
            io.emit('log-error', { file: filePath, message: error.message });
        }
    };

    // Función para el polling periódico
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

    // Iniciamos el polling cada 30 segundos (30000 milisegundos)
    const pollingInterval = setInterval(pollLatestLog, 30000);
    
    return { watcher, pollingInterval };
}

module.exports = { startLogWatcher };