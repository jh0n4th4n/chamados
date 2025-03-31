import styled from 'styled-components';

export const FiltersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }
`;

export const FilterSelect = styled.select`
  flex: 1 1 20%;
  min-width: 180px;
  max-width: 240px;
  height: 48px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1em;
  background-color: #f9f9f9;
  transition: all 0.3s ease-in-out;

  &:hover,
  &:focus {
    border-color: #0125f3;
    box-shadow: 0 0 5px rgba(1, 37, 243, 0.1);
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const FilterInput = styled.input`
  flex: 1 1 20%;
  min-width: 180px;
  max-width: 240px;
  height: 48px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1em;
  background-color: #f9f9f9;
  transition: all 0.3s ease-in-out;

  &:hover,
  &:focus {
    border-color: #0125f3;
    box-shadow: 0 0 5px rgba(1, 37, 243, 0.1);
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
