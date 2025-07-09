const axios = require('axios');

const sendDiscordNotification = async (message) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.log(`[${new Date().toLocaleString()}] Discord webhook URL not configured. Skipping notification.`);
        return;
    }

    try {
        await axios.post(webhookUrl, {
            content: message,
            username: '7D2D Server Monitor',
        });
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Error sending Discord notification:`, error.message);
    }
};

module.exports = { sendDiscordNotification };
