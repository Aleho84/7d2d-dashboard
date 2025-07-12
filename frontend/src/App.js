import React from 'react';
import './App.css';
import { useServerInfo } from './hooks/useServerInfo';
import ServerInfoCard from './components/ServerInfoCard';
import GameSettingsCard from './components/GameSettingsCard';
import PlayerListCard from './components/PlayerListCard';
import RawLogCard from './components/RawLogCard';
import { FiAlertTriangle } from 'react-icons/fi';

function App() {
    const { serverInfo, hardwareInfo, loading, error } = useServerInfo();

    // Un estado de carga que no sea un simple texto
    if (loading) {
        return (
            <div className="status-screen">
                <div className="loader"></div>
                <h2>Conectando con el servidor...</h2>
            </div>
        );
    }

    // Un estado de error que se vea como una alerta de verdad
    if (error || serverInfo.error) {
        return (
            <div className="status-screen error">
                <FiAlertTriangle size={48} />
                <h1>🧟 Fallo en la conexión</h1>
                <p>{error || serverInfo.error}</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <header className="app-header-themed">
                <h1>7 DAYS TO DIE</h1>
                <span>Los Tokones de Tokonas</span>
            </header>
            <main className="dashboard-grid">
                {/* Organizamos las tarjetas en áreas para un layout más complejo si queremos en el futuro */}
                <div className="grid-item grid-item-server-info">
                    <ServerInfoCard serverInfo={serverInfo} hardwareInfo={hardwareInfo} />
                </div>
                <div className="grid-item grid-item-players">
                    <PlayerListCard players={serverInfo.players} />
                </div>
                <div className="grid-item grid-item-settings">
                    <GameSettingsCard serverInfo={serverInfo} />
                </div>
                <div className="grid-item grid-item-log">
                    <RawLogCard rawLog={serverInfo.rawLog} />
                </div>
            </main>
        </div>
    );
}

export default App;