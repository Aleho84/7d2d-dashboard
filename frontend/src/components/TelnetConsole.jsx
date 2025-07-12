import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../services/socketService';
import { FiTerminal, FiSend } from 'react-icons/fi';

const TelnetConsole = () => {
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const historyRef = useRef(null);

    useEffect(() => {
        const handleTelnetResponse = (response) => {
            setHistory(prev => [...prev, { type: 'response', content: response }]);
            setIsSending(false);
        };

        const handleTelnetError = (error) => {
            setHistory(prev => [...prev, { type: 'error', content: `Error: ${error}` }]);
            setIsSending(false);
        };

        socket.on('telnet-response', handleTelnetResponse);
        socket.on('telnet-error', handleTelnetError);

        return () => {
            socket.off('telnet-response', handleTelnetResponse);
            socket.off('telnet-error', handleTelnetError);
        };
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom of history
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [history]);

    const sendCommand = () => {
        if (!command.trim() || isSending) return;

        setHistory(prev => [...prev, { type: 'command', content: command }]);
        socket.emit('execute-telnet-command', command);
        setIsSending(true);
        setCommand('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendCommand();
        }
    };

    return (
        <div className="telnet-console-card">
            <div className="card-header-themed">
                <FiTerminal size={20} className="header-icon" />
                <h3>Consola Telnet</h3>
            </div>
            <div className="card-body-themed">
                <div className="telnet-history" ref={historyRef}>
                    {history.map((line, index) => (
                        <div key={index} className={`history-line ${line.type}`}>
                            {line.type === 'command' && <span className="prompt">&gt;</span>}
                            <pre>{line.content}</pre>
                        </div>
                    ))}
                     {isSending && <div className="history-line response"><em>... Esperando respuesta ...</em></div>}
                </div>
                <div className="telnet-input-area">
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe un comando (ej: say 'hola a todos')"
                        disabled={isSending}
                        className="telnet-input"
                    />
                    <button onClick={sendCommand} disabled={isSending} className="telnet-send-btn">
                        <FiSend />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TelnetConsole;
