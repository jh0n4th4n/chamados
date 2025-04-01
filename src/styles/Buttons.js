import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Botão de novo chamado (como Link estilizado)
export const NewButton = styled(Link)`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #57B4BA;
  color: #fff;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 1em;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);

  svg {
    margin-right: 10px;
  }

  &:hover {
    background-color: #015551;
    transform: scale(1.03);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    float: none;
    justify-content: center;
  }
`;

// Botões de ação (editar, visualizar, excluir)
export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0125f3;
  color: #fff;
  padding: 8px 12px;
  font-size: 0.9em;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  margin-right: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: #001875;
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 6px;
  }
`;

// Botão para limpar filtros
export const ClearFiltersButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  background-color: #2b3458;
  color: #fff;
  font-size: 0.9em;
  font-weight: 600;
  margin-left: 10px;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  &:hover {
    background-color: #211c84;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    margin: 10px 0 0;
    background-color: #6c6aa7;
  }
`;

// Botão "Carregar mais"
export const BtnMore = styled.button`
  margin: 1.5em 0;
  padding: 0.8em 1.5em;
  background-color: #181c2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0125f3;
    transform: scale(1.03);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

// Mensagem de retorno (ex: sem chamados, erro, etc.)
export const FeedbackMessage = styled.div`
  background-color: #f0ad4e;
  color: white;
  padding: 14px;
  margin-bottom: 20px;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
  font-size: 0.95em;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
`;
