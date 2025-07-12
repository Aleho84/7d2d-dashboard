import { useState, useEffect } from 'react';
import { socket } from '../services/socketService';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export const useServerInfo = () => {
    const [serverInfo, setServerInfo] = useState(null);
    const [hardwareInfo, setHardwareInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await fetch(`${SOCKET_URL}/api/server-info`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setServerInfo(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        socket.on('log-update', (data) => {
            setServerInfo(data);
            setLoading(false);
            setError(null);
        });

        socket.on('hardware-info', (data) => {
            setHardwareInfo(data);
        });

        return () => {
            socket.off('log-update');
            socket.off('hardware-info');
        };
    }, []);

    return { serverInfo, hardwareInfo, loading, error };
};
