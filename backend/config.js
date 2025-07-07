require('dotenv').config();

module.exports = {
    logsDir: process.env.LOGS_DIR || 'F:/SteamLibrary/steamapps/common/7 Days to Die Dedicated Server',
    serverPort: process.env.PORT || 3001,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
