
const fsp = require('fs').promises;
const path = require('path');
const { getLatestLogFile } = require('../logFinder');
const { parseLogFile } = require('../logParser');
const { logsDir } = require('../../config');

jest.mock('fs', () => ({
    promises: {
        readdir: jest.fn(),
        stat: jest.fn(),
        readFile: jest.fn(),
    },
}));

jest.mock('../../config', () => ({
    logsDir: 'D:/fake/logs/dir',
}));

describe('logFinder', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getLatestLogFile', () => {
        it('should return the path to the most recent log file', async () => {
            const files = [
                'output_log_dedi__2025-07-09__10-00-00.txt',
                'output_log_dedi__2025-07-09__12-00-00.txt',
                'not-a-log-file.log',
            ];
            fsp.readdir.mockResolvedValue(files);
            fsp.stat.mockImplementation(filePath => {
                const fileName = path.basename(filePath);
                if (fileName === 'output_log_dedi__2025-07-09__10-00-00.txt') {
                    return Promise.resolve({ mtime: new Date('2025-07-09T10:00:00Z') });
                }
                if (fileName === 'output_log_dedi__2025-07-09__12-00-00.txt') {
                    return Promise.resolve({ mtime: new Date('2025-07-09T12:00:00Z') });
                }
                return Promise.resolve({ mtime: new Date('2025-07-09T09:00:00Z') });
            });

            const latestLogFile = await getLatestLogFile();
            expect(latestLogFile).toBe(path.join(logsDir, 'output_log_dedi__2025-07-09__12-00-00.txt'));
        });

        it('should return null if no log files are found', async () => {
            fsp.readdir.mockResolvedValue(['some-other-file.txt', 'another-file.log']);
            const latestLogFile = await getLatestLogFile();
            expect(latestLogFile).toBeNull();
        });

        it('should return null and log an error if reading the directory fails', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const error = new Error('Failed to read directory');
            fsp.readdir.mockRejectedValue(error);

            const latestLogFile = await getLatestLogFile();

            expect(latestLogFile).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error reading logs directory:'), error);
            consoleErrorSpy.mockRestore();
        });
    });
});

describe('logParser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('parseLogFile', () => {
        const mockLogPath = 'D:/fake/logs/dir/output_log_dedi__2025-07-09__12-00-00.txt';
        const mockStats = { mtime: new Date() };

        it('should correctly parse a full log file with all player status transitions', async () => {
            const logContent = `
GamePref.ServerName = My Test Server
GamePref.GameWorld = Navezgane
GamePref.ServerMaxPlayerCount = 8
[EOS] Session address: 127.0.0.1
[EOS] Registering server

// Player 1: Connects, joins, and then leaves. Final status: Offline
INF PlayerLogin: Player1
GMSG: Player 'Player1' joined the game
GMSG: Player 'Player1' left the game

// Player 2: Connects and joins. Final status: Online
INF PlayerLogin: Player2
GMSG: Player 'Player2' joined the game

// Player 3: Only connects. Final status: Connected
INF PlayerLogin: Player3

// Player 4: Joins without a connect event. Final status: Online
GMSG: Player 'Player4' joined the game
            `;
            fsp.stat.mockResolvedValue(mockStats);
            fsp.readFile.mockResolvedValue(logContent);

            const result = await parseLogFile(mockLogPath);

            expect(result.serverName).toBe('My Test Server');
            expect(result.mapName).toBe('Navezgane');
            expect(result.maxPlayers).toBe(8);
            expect(result.publicIp).toBe('127.0.0.1');
            expect(result.serverStatus).toBe('Online');
            expect(result.players).toHaveLength(4);
            expect(result.players).toContainEqual({ id: 'Player1', name: 'Player1', status: 'Offline' });
            expect(result.players).toContainEqual({ id: 'Player2', name: 'Player2', status: 'Online' });
            expect(result.players).toContainEqual({ id: 'Player3', name: 'Player3', status: 'Connected' });
            expect(result.players).toContainEqual({ id: 'N/A', name: 'Player4', status: 'Online' });
            expect(result.lastModified).toBe(mockStats.mtime.toISOString());
        });

        it('should handle missing log file information gracefully', async () => {
            const logContent = `
Some random log content
without any game preferences.
            `;
            fsp.stat.mockResolvedValue(mockStats);
            fsp.readFile.mockResolvedValue(logContent);

            const result = await parseLogFile(mockLogPath);

            expect(result.serverName).toBe('N/A');
            expect(result.mapName).toBe('N/A');
            expect(result.maxPlayers).toBe('N/A');
            expect(result.publicIp).toBe('N/A');
            expect(result.serverStatus).toBe('Unknown');
            expect(result.players).toEqual([]);
        });

        it('should determine server status as Offline correctly', async () => {
            const logContent = `
[EOS] Registering server
[EOS] Server unregistered
            `;
            fsp.stat.mockResolvedValue(mockStats);
            fsp.readFile.mockResolvedValue(logContent);

            const result = await parseLogFile(mockLogPath);
            expect(result.serverStatus).toBe('Offline');
        });

        it('should return an error object if filePath is null', async () => {
            const result = await parseLogFile(null);
            expect(result).toEqual({ error: 'No log file found' });
        });

        it('should return an error object if reading the file fails', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const error = new Error('Failed to read file');
            fsp.stat.mockRejectedValue(error);

            const result = await parseLogFile(mockLogPath);

            expect(result).toEqual({ error: 'Error parsing log file' });
            expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error parsing log file:'), error);
            consoleErrorSpy.mockRestore();
        });
    });
});
