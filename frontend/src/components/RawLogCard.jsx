import React from 'react';
import { FiTerminal } from 'react-icons/fi';

const RawLogCard = ({ rawLog }) => {
  const logContent =
    rawLog && rawLog.trim().length > 0
      ? rawLog.split('\n').reverse().join('\n')
      : '...Esperando señales de vida del servidor...';

  return (
    <div className="server-info-card">
      <div className="card-header-themed">
        <FiTerminal size={20} className="header-icon" />
        <h3>Bitácora del Servidor</h3>
      </div>
      <div className="card-body-themed log-card-body">
        <pre className="log-container">
          <code>{logContent}</code>
        </pre>
      </div>
    </div>
  );
};

export default RawLogCard;
