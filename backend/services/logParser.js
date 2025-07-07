const fsp = require('fs').promises;

async function parseLogFile(filePath) {
    if (!filePath) {
        return { error: 'No log file found' };
    }
    try {
        const stats = await fsp.stat(filePath);
        const lastModified = stats.mtime;
        const content = await fsp.readFile(filePath, 'utf-8');

        const serverNameMatch = content.match(/GamePref\.ServerName = (.*)/);
        const mapNameMatch = content.match(/GamePref\.GameWorld = (.*)/);
        const maxPlayersMatch = content.match(/GamePref\.ServerMaxPlayerCount = (.*)/);
        const xpMultiplierMatch = content.match(/GamePref\.XPMultiplier = (.*)/);
        const lootAbundanceMatch = content.match(/GamePref\.LootAbundance = (.*)/);
        const dayNightLengthMatch = content.match(/GamePref\.DayNightLength = (.*)/);
        const blockDamageAIMatch = content.match(/GamePref\.BlockDamageAI = (.*)/);
        const telnetPortMatch = content.match(/GamePref\.TelnetPort = (.*)/);
        const webDashboardPortMatch = content.match(/GamePref\.WebDashboardPort = (.*)/);
        const publicIpMatch = content.match(/\[EOS\] Session address: (.*)/);

        let serverStatus = 'Unknown'; // Default status

        const serverUnregisteredRegex = /\[EOS\] Server unregistered/g;
        const serverRegisteredRegex = /\[EOS\] Registering server/g;

        let lastUnregisteredIndex = -1;
        let lastRegisteredIndex = -1;

        let match;
        while ((match = serverUnregisteredRegex.exec(content)) !== null) {
            lastUnregisteredIndex = match.index;
        }
        while ((match = serverRegisteredRegex.exec(content)) !== null) {
            lastRegisteredIndex = match.index;
        }

        if (lastRegisteredIndex > lastUnregisteredIndex) {
            serverStatus = 'Online';
        } else if (lastUnregisteredIndex > lastRegisteredIndex) {
            serverStatus = 'Offline';
        }

        const events = [];
        const playerConnectedRegex = /INF PlayerLogin: ([a-zA-Z0-9_]+)/g;
        while ((match = playerConnectedRegex.exec(content)) !== null) {
            const playerName = match[1].trim();
            events.push({
                index: match.index,
                type: 'connect',
                id: playerName, // Using name as ID since entityid is not available
                name: playerName
            });
        }

        const playerJoinedRegex = /GMSG: Player '([^']*)' joined the game/g;
        while ((match = playerJoinedRegex.exec(content)) !== null) {
            events.push({
                index: match.index,
                type: 'join',
                name: match[1].trim()
            });
        }

        const playerLeftRegex = /GMSG: Player '([^']*)' left the game/g;
        while ((match = playerLeftRegex.exec(content)) !== null) {
            events.push({
                index: match.index,
                type: 'left',
                name: match[1].trim()
            });
        }

        events.sort((a, b) => a.index - b.index);

        const allPlayers = new Map();

        for (const event of events) {
            if (event.type === 'connect') {
                allPlayers.set(event.name, { id: event.id, name: event.name, status: 'Connected' });
            } else if (event.type === 'join') {
                if (allPlayers.has(event.name)) {
                    allPlayers.get(event.name).status = 'Online';
                } else {
                    allPlayers.set(event.name, { id: 'N/A', name: event.name, status: 'Online' });
                }
            } else if (event.type === 'left') {
                if (allPlayers.has(event.name)) {
                    allPlayers.get(event.name).status = 'Offline';
                }
            }
        }

        const players = Array.from(allPlayers.values());

        return {
            serverName: serverNameMatch ? serverNameMatch[1].trim() : 'N/A',
            mapName: mapNameMatch ? mapNameMatch[1].trim() : 'N/A',
            maxPlayers: maxPlayersMatch ? parseInt(maxPlayersMatch[1], 10) : 'N/A',
            xpMultiplier: xpMultiplierMatch ? parseInt(xpMultiplierMatch[1], 10) : 'N/A',
            lootAbundance: lootAbundanceMatch ? parseInt(lootAbundanceMatch[1], 10) : 'N/A',
            dayNightLength: dayNightLengthMatch ? parseInt(dayNightLengthMatch[1], 10) : 'N/A',
            blockDamageAI: blockDamageAIMatch ? parseInt(blockDamageAIMatch[1], 10) : 'N/A',
            telnetPort: telnetPortMatch ? parseInt(telnetPortMatch[1], 10) : 'N/A',
            webDashboardPort: webDashboardPortMatch ? parseInt(webDashboardPortMatch[1], 10) : 'N/A',
            publicIp: publicIpMatch ? publicIpMatch[1].trim() : 'N/A',
            serverStatus,
            players,
            rawLog: content,
            lastModified: lastModified.toISOString() // Add last modified timestamp
        };
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Error parsing log file:`, error);
        return { error: 'Error parsing log file' };
    }
}

module.exports = { parseLogFile };
