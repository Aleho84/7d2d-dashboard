import { useState, useEffect } from 'react';
import { socket } from '../services/socketService';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export const useServerInfo = (token) => {
    const [serverInfo, setServerInfo] = useState(null);
    const [hardwareInfo, setHardwareInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            // Solo intentar hacer fetch si hay un token.
            if (token) {
                setLoading(true); // Iniciar carga solo cuando intentamos el fetch
                setError(null); // Limpiar errores previos
                try {
                    const response = await fetch(`${SOCKET_URL}/api/server-info`, {
                        headers: {
                            'x-auth-token': token,
                        },
                    });
                    if (!response.ok) {
                        // Si el token es inválido, el servidor devolverá 401
                        if (response.status === 401) {
                            // Opcional: podrías querer limpiar el token aquí
                            localStorage.removeItem('token');
                        }
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setServerInfo(data);
                } catch (e) {
                    setError(e.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchInitialData();

        // La lógica de los sockets puede permanecer igual, 
        // ya que solo se activa cuando el servidor emite eventos.
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
    }, [token]);

    return { serverInfo, hardwareInfo, loading, error };
};
