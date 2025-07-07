const chokidar = require('chokidar');
const path = require('path');
const { logsDir } = require('../config');
const { parseLogFile } = require('./logParser');
const { getLatestLogFile } = require('./logFinder');

function startLogWatcher(io) {
    const watcher = chokidar.watch(
        logsDir, {
        ignored: /(^|[\/])\../, persistent: true, ignoreInitial: true,
    });

    const emitLogUpdate = async (filePath) => {
        console.log(`Log file updated: ${filePath}`); const data = await parseLogFile(filePath); io.emit('log-update', data);
    };

    watcher.on('add', async (filePath) => {
        if (filePath.startsWith(path.join(logsDir, 'output_log_dedi__'))) { console.log(`New log file detected: ${filePath}`); const latestLogFile = await getLatestLogFile(); if (filePath === latestLogFile) { await emitLogUpdate(filePath); } }
    });

    watcher.on('change', async (filePath) => {
        const latestLogFile = await getLatestLogFile(); if (filePath === latestLogFile) { await emitLogUpdate(filePath); }
    });

    console.log(`Watching for log changes in: ${logsDir}`);
    return watcher;
} module.exports = { startLogWatcher };