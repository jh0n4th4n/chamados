// components/StyledTable.js
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
`;

export const Span = styled.span`
  display: flex;
  padding: 10px;
  font-weight:600;
`;

export const FormProfile = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  border-radius: 10px;
  background-color: #fff;
  gap: 20px;

  @media screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    padding: 15px;
    gap: 1px;
  }
`;

export const StyledLabel = styled.label`
  margin-right: 10px;
  text-align: left;
  color: #333;
  font-weight: 500;
  font-size: 0.95em;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  margin: 5px 0 10px;
  outline: none;
  background-color: #f9f9f9;
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: #0125f3;
  }

  &:focus {
    border-color: #0125f3;
    box-shadow: 0 0 5px rgba(1, 37, 243, 0.5);
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  margin: 5px 0 10px;
  outline: none;
  background-color: #f9f9f9;
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: #0125f3;
  }

  &:focus {
    border-color: #0125f3;
    box-shadow: 0 0 5px rgba(1, 37, 243, 0.5);
  }
`;

export const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #001875;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 1.2em;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color:rgb(2, 14, 61);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fafbfc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  table-layout: fixed;

  caption {
    font-size: 1.5em;
    margin: 0.5em 0 0.75em;
    font-weight: 600;
    color: #333;
  }

  thead th {
    font-size: 1em;
    background-color: #2b3458;
    color: #f8f8f8;
    font-weight: 600;
    padding: 15px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  tbody tr {
    background-color:rgb(255, 255, 255);
    transition: background-color 0.3s ease;
    margin-bottom: 20px;
    border: 1px solid #ccc;
  }

  th, td {
    padding: 12px;
    text-align: center;
    color: #555;
    border-bottom: 1px solid #e0e0e0;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
    cursor: pointer;
    font-weight: 600;
  }

  td .action {
    border: 0;
    padding: 8px 12px;
    border-radius: 5px;
    display: inline-block;
    margin-right: 5px;
    background-color: #0125f3;
    color: #fff;
    font-size: 0.9em;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  td .action:hover {
    transform: scale(1.05);
    background-color: #001875;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  td .badge {
    padding: 5px 10px;
    border-radius: 5px;
    color: #fff;
    font-size: 0.9em;
  }

  @media screen and (max-width: 768px) {
    border: 0;
    thead {
      display: none;
    }

    tr {
      display: block;
      margin-bottom: 0.75em;
      border-bottom: 2px solid #ccc;
    }

    td {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      font-size: 0.9em;
      border-bottom: 1px solid #e0e0e0;
    }

    td::before {
      content: attr(data-label);
      font-weight: bold;
      color: #333;
    }

    .action {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 8px;
      width: 100%;
    }
  }
`;

export const LoadMoreButton = styled.button`
  width: 200px;
  margin-left: 20px;
  margin-top: 1.5em;
  padding: 0.8em 1.5em;
  background-color: #181c2e;
  border: 0;
  border-radius: 8px;
  font-size: 1.1em;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color:rgb(5, 18, 90);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: scale(1.02);
  }
`;

export const ActionButton = styled.button`
  border: 0;
  padding: 8px 12px;
  border-radius: 5px;
  margin-right: 5px;
  font-size: 0.9em;
  color: #fff;
  background-color: #0125f3;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    background-color: #001875;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 8px;
    width: 100px;

    &:hover {
      transform: scale(1);
    }
  }
`;

export const FeedbackMessage = styled.div`
  background-color: #f0ad4e;
  color: white;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
