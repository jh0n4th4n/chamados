import React from 'react';
import './AccessDenied.css'; // Importe o arquivo CSS

const AccessDenied = () => {
  return (
    <div className="access-denied-container">
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <a href="/dashboard" className="back-button">Fazer Login Novamente</a>
    </div>
  );
};

export default AccessDenied;
