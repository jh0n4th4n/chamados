import React from 'react';

function ChamadoRow({ chamado, onDelete, onToggleModal }) {
  return (
    <tr>
      <td>{chamado.cliente}</td>
      <td>{chamado.assunto}</td>
      <td>{chamado.status}</td>
      <td>{chamado.createdFormat}</td>
      <td>
        <button onClick={onToggleModal}>Detalhes</button>
        <button onClick={onDelete}>Excluir</button>
      </td>
    </tr>
  );
}

export default ChamadoRow;
