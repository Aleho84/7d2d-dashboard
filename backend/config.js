require('dotenv').config();

module.exports = {
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
    serverPort: process.env.PORT || 3001,
    logsDir: process.env.GAME_LOGS_DIR || '/home/user/7d2d_server/7DaysToDieServer_Data/',   
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,   
    telnet: {
        host: process.env.GAME_HOST || '127.0.0.1',
        port: process.env.TELNET_PORT || 8081,
        password: process.env.TELNET_PASSWORD || ''        
    }
};
