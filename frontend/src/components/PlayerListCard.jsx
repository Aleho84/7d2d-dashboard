import React from 'react';
import { FiUsers, FiSlash } from 'react-icons/fi';

const PlayerListCard = ({ players }) => {
  const statusOrder = { 'Online': 0, 'Connected': 1, 'Offline': 2 };

  const sortedPlayers = players
    ? [...players].sort((a, b) => {
        if (a.status !== b.status) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return a.name.localeCompare(b.name);
      })
    : [];

  return (
    <div className="server-info-card">
      <div className="card-header-themed">
        <FiUsers size={20} className="header-icon" />
        <h3>Lista de Jugadores</h3>
      </div>
      <div className="card-body-themed player-list-body">
        {sortedPlayers.length > 0 ? (
          <div className="player-list">
            {sortedPlayers.map((player) => (
              <div className="player-row" key={player.id || player.name}>
                <span className="player-name">{player.name}</span>
                <span
                  className={`status-pill ${
                    player.status === 'Online'
                      ? 'status-online'
                      : player.status === 'Connected'
                      ? 'status-connected'
                      : 'status-offline'
                  }`}
                >
                  {player.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-list-message">
            <FiSlash size={24} />
            <p>
              El servidor está más vacío que heladera de fin de mes. No hay
              sobrevivientes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerListCard;
