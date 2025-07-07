const fsp = require('fs').promises;
const path = require('path');
const { logsDir } = require('../config');

async function getLatestLogFile() {
    try {
        const files = await fsp.readdir(logsDir);
        const logFiles = files.filter(file => file.startsWith('output_log_dedi__') && file.endsWith('.txt'));
        if (logFiles.length === 0) {
            return null;
        }

        const fileStats = await Promise.all(
            logFiles.map(async (file) => {
                const stats = await fsp.stat(path.join(logsDir, file));
                return { file, mtime: stats.mtime };
            })
        );

        fileStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

        return path.join(logsDir, fileStats[0].file);
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Error reading logs directory:`, error);
        return null;
    }
}

module.exports = { getLatestLogFile };
