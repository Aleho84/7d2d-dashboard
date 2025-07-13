const axios = require('axios');

const sendDiscordNotification = async (message) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        // No logueamos nada si no está configurado, para no llenar la consola.
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

const sendServerStatusNotification = async (status) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const isOnline = status === 'Online';
    const embed = {
        title: `Server is now ${status}`,
        color: isOnline ? 3066993 : 15158332, // Verde para Online, Rojo para Offline
        timestamp: new Date().toISOString(),
        footer: {
            text: '7D2D Real-Time Dashboard'
        }
    };

    try {
        await axios.post(webhookUrl, {
            username: '7D2D Server Monitor',
            embeds: [embed]
        });
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Error sending server status notification:`, error.message);
    }
};

module.exports = { sendDiscordNotification, sendServerStatusNotification };
