import React from 'react';
import { FiSettings } from 'react-icons/fi';

const GameSettingsCard = ({ serverInfo }) => {
  return (
    <div className="server-info-card">
      <div className="card-header-themed">
        <FiSettings size={20} className="header-icon" />
        <h3>Ajustes del Servidor</h3>
      </div>
      <div className="card-body-themed">
        <div className="info-grid">
          <div className="info-item">
            <span>Multiplicador XP:</span>
            <p>{serverInfo.xpMultiplier}%</p>
          </div>
          <div className="info-item">
            <span>Abundancia de Loot:</span>
            <p>{serverInfo.lootAbundance}%</p>
          </div>
          <div className="info-item">
            <span>Duración Día/Noche:</span>
            <p>{serverInfo.dayNightLength} mins</p>
          </div>
          <div className="info-item">
            <span>Daño a Bloques (IA):</span>
            <p>{serverInfo.blockDamageAI}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsCard;
