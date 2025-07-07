import React from 'react';
import { FiServer, FiWifi, FiWifiOff } from 'react-icons/fi';

const ServerInfoCard = ({ serverInfo }) => {
  const isOnline = serverInfo.serverStatus === 'Online';

  return (
    <div className="server-info-card">
      <div className="card-header-themed">
        <FiServer size={20} className="header-icon" />
        <h3>Información del Servidor</h3>
      </div>
      <div className="card-body-themed">
        <div className="info-grid">
          <div className="info-item">
            <span>Nombre del Server:</span>
            <p>{serverInfo.serverName}</p>
          </div>
          <div className="info-item">
            <span>IP Pública:</span>
            <p className="ip-address">{serverInfo.publicIp}</p>
          </div>
          <div className="info-item">
            <span>Mapa:</span>
            <p>{serverInfo.mapName}</p>
          </div>
          <div className="info-item">
            <span>Web Dashboard Port:</span>
            <p>{serverInfo.webDashboardPort}</p>
          </div>
          <div className="info-item">
            <span>Jugadores Máximos:</span>
            <p>{serverInfo.maxPlayers}</p>
          </div>
          <div className="info-item">
            <span>Telnet Port:</span>
            <p>{serverInfo.telnetPort}</p>
          </div>
        </div>

        <div className="server-status">
          <span>Estado del Servidor:</span>
          <span
            className={`status-pill ${
              isOnline ? 'status-online' : 'status-offline'
            }`}
          >
            {isOnline ? <FiWifi size={14} /> : <FiWifiOff size={14} />}
            {serverInfo.serverStatus}
          </span>
        </div>

        <div className="last-update">
          Última comunicación:{' '}
          {new Date(serverInfo.lastModified).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ServerInfoCard;
