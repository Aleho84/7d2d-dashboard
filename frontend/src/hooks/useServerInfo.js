import { useState, useEffect } from 'react';
import { socket } from '../services/socketService';

export const useServerInfo = () => {
    const [serverInfo, setServerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/server-info');
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

        return () => {
            socket.off('log-update');
        };
    }, []);

    return { serverInfo, loading, error };
};
